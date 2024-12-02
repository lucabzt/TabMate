import Tab from './utils/tab';
import TabGroup from './utils/tab_group';
import error from 'eslint-plugin-react/lib/util/error';

async function generateGroupNames(model, tabs) {
  const tabs_str = tabs.map(t => t.toString()).join(", ");
  const prompt = `
You are an assistant that organizes browser tabs into groups. Based on the following tabs, create a list of meaningful group names that categorize the tabs.

Tabs:
${tabs_str}

Guidelines:
1. Use plain English for all group names.
2. Keep group names concise (maximum two words).
3. Ensure the output is plain text, with one group name per line.

IMPORTANT: The output should contain exactly ${Math.max(Math.round(tabs.length / 3), 1)} Group Names.

Please provide your response strictly as a plain text list.
`;
  console.log("___TRYING TO GENERATE GROUP NAMES IN AMOUNT___" + Math.max(Math.round(tabs.length / 3), 1))
  const response = await model.prompt(prompt);
  console.log("___GENERATED GROUP NAMES___")
  return response.trim().split('\n').map(name => name.trim()).filter(name => name !== '');
}

async function assignTabsToGroups(model, tabs, groupNames) {
  const groups = {};

  // Initialize TabGroup instances for each group name
  groupNames.forEach(name => {
    groups[name] = new TabGroup(name, []);
  });

  // For each tab, determine the group
  for (const tab of tabs) {
    const prompt = `
You are an assistant that categorizes browser tabs into predefined groups. Given the tab and the list of group names, identify the best group.

Tab:
${tab.toString()}

Group Names (plain English only):
${groupNames.join(', ')}

Guidelines:
1. Your output should be formatted like this: Group: group_name. Example Output: 
  Group: Master Thesis
2. Output only plain English without any additional formatting or non-English text.
3. Ensure the output matches one of the provided group names exactly.

IMPORTANT: Any response not in plain English or not matching the group names will be invalid.
`;
    let groupName;
    try {
      const response = await model.prompt(prompt);
      groupName = response.split(':')[1].trim();
    }
    catch (error) {
      console.warn("Error trying to group tab " + tab.url + ": " + error);
      continue;
    }

    // Add tab to the appropriate group
    if (groups[groupName]) {
      groups[groupName].addTab(tab.id);
    } else {
      // Handle cases where the group name is unrecognized
      console.warn(`Unrecognized group name "${groupName}" for Tab ID ${tab.id}.`);
    }
  }

  // Return an array of TabGroup instances
  return Object.values(groups);
}

async function group_tabs(model, tabs) {
  // Step 1: Generate group names
  const groupNames = await generateGroupNames(model, tabs);
  groupNames.push("Other")
  console.log("GROUP NAMES: " + groupNames);

  // Step 2: Assign tabs to groups
  const groups = await assignTabsToGroups(model, tabs, groupNames);

  for (const group of groups) {
    if (group.tab_ids.length <= 0) continue;

    // Get the first tab's window
    const firstTab = await chrome.tabs.get(group.tab_ids[0]);
    const window = await chrome.windows.get(firstTab.windowId);

    // Skip if the window is not normal
    if (window.type !== 'normal') {
      console.warn(`Cannot group tabs in a non-normal window: ${window.type}`);
      continue;
    }

    // Group the tabs
    const groupId = await chrome.tabs.group({
      tabIds: group.tab_ids,
      createProperties: {windowId: firstTab.windowId},
    });

    await chrome.tabGroups.update(groupId, { title: group.name });
  }

  return groups;
}


export default group_tabs;


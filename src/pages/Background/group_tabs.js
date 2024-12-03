import Tab from './utils/tab';
import TabGroup from './utils/tab_group';
import error from 'eslint-plugin-react/lib/util/error';

async function generateGroupNames(model, tabs) {
  const tabs_str = tabs.map(t => t.toString()).join(", ");
  const prompt = `
  Your list should contain ${Math.max(Math.round(tabs.length / 3), 1)} elements.
  ${tabs_str}
  `
  console.log("___TRYING TO GENERATE GROUP NAMES IN AMOUNT___" + Math.max(Math.round(tabs.length / 3), 1))
  const response = await model.prompt(prompt);
  console.log(response);
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
      Tab:
      ${tab.toString()}
      
      Group Names:
      ${groupNames.join(', ')}
    `;
    let groupName;
    try {
      const response = await model.prompt(prompt);
      groupName = response.split(':')[1].trim();
    }
    catch (error) {
      console.warn("Error trying to group tab" + tab.url + ": " + error);
      groupName = "Other";
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

async function group_tabs(naming_model, grouping_model, tabs) {
  // Step 1: Generate group names
  const groupNames = await generateGroupNames(naming_model, tabs);
  groupNames.push("Other")

  // Step 2: Assign tabs to groups
  const groups = await assignTabsToGroups(grouping_model, tabs, groupNames);

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


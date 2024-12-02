import Tab from './utils/tab';
import TabGroup from './utils/tab_group';

const PROMPT = `
You are a smart assistant that organizes browser tabs into meaningful groups based on their content summaries and URLs. Each tab is represented as a string in the following format:

{ID: <tab_id>
URL: <tab_url>
GROUP: <group_name>
CONTENT: <content_summary>}

Please group these tabs into meaningful categories. Provide the result in a clear, organized list, where each group is named and the corresponding tab IDs are listed. A sample output could look like this:

Group Name: Work
Tab IDs: 1, 2, 3

Group Name: Research
Tab IDs: 4, 5

The groups should be named clearly and represent meaningful categories.

IMPORTANT: All your output should be in English and as a string.

Here are the tabs:
`;

function parseLLMOutput(output) {
  const groups = [];
  const groupBlocks = output.trim().split(/\n\n+/);

  groupBlocks.forEach(block => {
    const lines = block.split('\n').map(line => line.trim());
    let groupName = '';
    let tabIds = [];

    lines.forEach(line => {
      if (line.startsWith('Group Name:')) {
        groupName = line.replace('Group Name:', '').trim();
      } else if (line.startsWith('Tab IDs:')) {
        tabIds = line.replace('Tab IDs:', '')
          .split(',')
          .map(id => id.trim())
          .map(Number);
      }
    });

    if (groupName && tabIds.length > 0) {
      groups.push({ group_name: groupName, tab_ids: tabIds });
    }
  });

  return groups;
}

async function group_tabs(model, tabs) {
  let group_json;
  const groups = []
  const tabs_str = tabs.map(t => t.toString()).join(", ");
  const response = await model.prompt(
    PROMPT + tabs_str,
  )
  // Parse the string into a JavaScript array
  try {
    console.log("LLM RESPONSE, UNPARSED: \n "+ response);
    group_json = parseLLMOutput(response);
  } catch (error) {
    console.error("Error parsing LLM output:", error);
  }

  // Accessing the groups
  group_json.forEach(group => {
    groups.push(
      new TabGroup(group.group_name, group.tab_ids)
    );
  });

  console.log(groups);
}

export default group_tabs;
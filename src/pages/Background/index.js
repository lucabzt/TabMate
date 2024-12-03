import Model from './model';
import TabManager from './tab_manager';
import { creationPrompt, groupingPrompt } from './prompts';

// Initialize models
const NamingModel = new Model();
await NamingModel.init(creationPrompt);

const GroupingModel = new Model();
await GroupingModel.init(groupingPrompt);

// Init TabManager
const manager = new TabManager(NamingModel, GroupingModel);
await manager.updateActiveTabs();

// Group Tabs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'group_tabs') {
    manager.groupTabs()
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keeps the message channel open for asynchronous response
  }
});
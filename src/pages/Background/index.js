import Model from './model';
import group_tabs from './group_tabs';
import TabManager from './tab_manager';

// Initialize model
const model = new Model();
await model.init();

// First try prompting the model
const result = await model.prompt("How are you doing today?");
console.log(result);

// Init TabManager
const manager = new TabManager(model);
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
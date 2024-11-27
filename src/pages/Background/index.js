console.log('Background page loaded.');

if (chrome.aiOriginTrial && chrome.aiOriginTrial.languageModel) {
  console.log('Prompt API is available.');

  async function groupTabs() {
    try {
      const model = await chrome.aiOriginTrial.languageModel.capabilities();
      console.log('Language Model Capabilities:', model);
    } catch (err) {
      console.error('Error calling language model capabilities:', err);
    }
  }

  groupTabs();
} else {
  console.error('Prompt API is not available. Check manifest.json and trial tokens.');
}

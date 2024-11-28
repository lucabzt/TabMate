class Model {
  constructor() {
    this.model = null;
  }

  async init(systemPrompt = null) {
    console.log("Initializing model...");
    this.model = await chrome.aiOriginTrial.languageModel.create();
    console.log("Model initialized successfully.");
  }

  async prompt(prompt) {
    return this.model.prompt(prompt);
  }
}

export default Model;
class Model {
  constructor() {
    this.model = null;
    this.preprompt = null;
  }

  async init(prePrompt = null) {
    this.preprompt = prePrompt;
    console.log("Initializing model...");
    this.model = await chrome.aiOriginTrial.languageModel.create({
      temperature: 0.0,
      topK: 10
    });
    console.log("Model initialized successfully.");
  }

  async prompt(prompt) {
    return this.model.prompt(this.preprompt + '\n' + prompt);
  }
}

export default Model;
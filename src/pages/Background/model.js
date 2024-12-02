class Model {
  constructor() {
    this.model = null;
  }

  async init(systemPrompt = null) {
    console.log("Initializing model...");
    this.model = await chrome.aiOriginTrial.languageModel.create({
      temperature: 0.5,
      topK: 3,
      systemPrompt: "You are an AI assistant that responds strictly in Plain English. No json, no german, only english. If you respond in an untested language my program will die."
    });
    console.log("Model initialized successfully.");
  }

  async prompt(prompt) {
    return this.model.prompt(prompt);
  }
}

export default Model;
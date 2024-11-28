import Model from './model';

// Initialize model
const model = new Model();
await model.init()

// First try prompting the model
const result = await model.prompt("How are you doing today?")
console.log(result)

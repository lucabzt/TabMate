async function groupTabs() {
  let model = await chrome.aiOriginTrial.languageModel.capabilities()
  console.log(model)
}

export default groupTabs
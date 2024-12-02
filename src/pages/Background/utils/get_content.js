function getContent(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: () => {
          // This function runs in the context of the page
          // Extract the main content
          const mainContent = document.body.innerText || '';
          return mainContent;
        },
      },
      (injectionResults) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
          return;
        }

        if (injectionResults && injectionResults[0] && injectionResults[0].result) {
          resolve(injectionResults[0].result);
        } else {
          reject('No content found.');
        }
      }
    );
  });
}

function isRestrictedUrl(url) {
  const restrictedProtocols = ['chrome:', 'chrome-extension:', 'about:', 'edge:'];
  const restrictedUrls = ['https://chrome.google.com/webstore'];

  try {
    const urlObj = new URL(url);
    if (restrictedProtocols.includes(urlObj.protocol)) {
      return true;
    }
    if (restrictedUrls.includes(url)) {
      return true;
    }
    return false;
  } catch (e) {
    // If the URL is invalid or can't be parsed, consider it restricted
    return true;
  }
}

export { getContent, isRestrictedUrl };
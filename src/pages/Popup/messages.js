function groupTabs() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "group_tabs" }, (response) => {
      if (response && response.success) {
        console.log("Tabs grouped successfully:", response.data);
        resolve(response.data);
      } else {
        console.error("Error grouping tabs:", response?.error);
        reject(response?.error);
      }
    });
  });
}

export {groupTabs};
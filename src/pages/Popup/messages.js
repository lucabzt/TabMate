function groupTabs (){
  chrome.runtime.sendMessage({ action: "group_tabs" }, (response) => {
    if (response && response.success) {
      console.log("Tabs grouped successfully:", response.data);
    } else {
      console.error("Error grouping tabs:", response?.error);
    }
  });
}

export {groupTabs};
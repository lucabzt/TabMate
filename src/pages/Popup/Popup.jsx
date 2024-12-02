import React from 'react';
import './Popup.css';

function Popup() {
  const groupTabs = () => {
    chrome.runtime.sendMessage({ action: 'group_tabs' }, (response) => {
      if (response && response.success) {
        console.log('Tabs grouped successfully:', response.data);
      } else {
        console.error('Error grouping tabs:', response?.error);
      }
    });
  };

  return (
    <div className="App">
      <button
        className="GroupTabs"
        onClick={groupTabs}
      >
        Group Tabs
      </button>
    </div>
  );
}

export default Popup;

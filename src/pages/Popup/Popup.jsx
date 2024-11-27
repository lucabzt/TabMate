import React from 'react';
import './Popup.css';

function Popup() {
  const groupTabs = () => {
    console.log("Grouping Tabs now.")
  }

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

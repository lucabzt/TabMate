import React from 'react';
import './Popup.css';

function Popup() {
  const handleGroupTabs = () => {
    // Logic for grouping tabs will be added here
    console.log("Group Tabs button clicked!");
  };

  return (
    <div className="App">
      <button
        className="GroupTabs"
        onClick={handleGroupTabs}
      >
        Group Tabs
      </button>
    </div>
  );
}

export default Popup;

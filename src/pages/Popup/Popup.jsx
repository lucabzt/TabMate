import React from 'react';
import './Popup.css';
import { groupTabs } from './messages';

function ActionButton({ title, onClick }) {
  return (
    <button className="ActionButton" onClick={onClick}>
      {title}
    </button>
  );
}

function Popup() {
  return (
    <div className="App">
      <div className="ShortCuts">
        Shortcuts
        <div className="Buttons">
          <ActionButton title="Group Tabs" onClick={groupTabs} />
          <ActionButton title="Close unused Tabs" onClick={() => console.log('close unused Tabs')} />
          <button className="AddButton" onClick={() => console.log('add preset')}>
            add shortcut
          </button>
        </div>
      </div>
      <input type="text" id="inputBox" className="TextBoxInput" placeholder="Ask me anything..." />
    </div>
  );
}

export default Popup;

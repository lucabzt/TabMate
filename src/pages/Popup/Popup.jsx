import React, { useState } from 'react';
import './Popup.css';
import { groupTabs } from './messages';

function ActionButton({ title, onClick }) {
  let [isThinking, setThinking] = useState(false);

  const handleClick = () => {
    setThinking(true);

    onClick().then(() => {
      setThinking(false);
    });
  };

  return (
    <button
      className={isThinking ? "Thinking" : "ActionButton"}
      onClick={handleClick}
      disabled={isThinking}
    >
      {isThinking ? (
        <>
          <span className="wave-text">
            {"THINKING...".split("").map((letter, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                {letter}
              </span>
            ))}
          </span>
        </>
      ) : (
        title
      )}
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
          <ActionButton
            title="Close unused Tabs"
            onClick={() => console.log("close unused Tabs")}
          />
          <button
            className="AddButton"
            onClick={() => console.log("add preset")}
          >
            add shortcut
          </button>
        </div>
      </div>
      <input
        type="text"
        id="inputBox"
        className="TextBoxInput"
        placeholder="Ask me anything..."
      />
    </div>
  );
}

export default Popup;

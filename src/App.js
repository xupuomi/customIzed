// App.js
import React, { useState } from 'react';
import './index.css';
import main from './main-logo.png';
import LeftColumn from './left.js';

const App = () => {
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [recipientInfo, setrecipientInfo] = useState("");
  const [additionalInfo, setInfo] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showResponses, setShowResponses] = useState(false);

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value,
          name: name,
          recipientInfo: recipientInfo,
          additionalInfo: additionalInfo
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.json();
      console.log("Response data", data);
      
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [{ text: value }],
        },
        {
          role: "model",
          parts: [{ text: data.response1 }],
        },
        {
          role: "model",
          parts: [{ text: data.response2 }],
        },
      ]);
      setShowResponses(true);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again.");
    }
  };

  const clear = () => {
    setValue("");
    setrecipientInfo("");
    setError("");
    setInfo("");
    setChatHistory([]);
    setShowResponses(false);
  };

  return (
    <div className="container">
      {!showResponses ? (
        <>
          <LeftColumn 
            value={value}
            setValue={setValue}
            name={name}
            setName={setName}
            recipientInfo={recipientInfo}
            setrecipientInfo={setrecipientInfo}
            additionalInfo={additionalInfo}
            setInfo={setInfo}
          />
          <div className="column-right info-text">
            <img src={main} alt="main title" style={{ width: '530px', height: 'auto' }} />
            <div className='title-text-section'>
              <div className='main-page-text'>
                1. Paste your email template and insert <span className="bold">[fill in here + </span> <span className="italics">topic</span> <span className="bold">]</span>
                where you need customization
              </div>
              <div className='main-page-text'>
                2. Paste the recipient's name
              </div>
              <div className='main-page-text'>
                3. Paste the background information about the recipient
              </div>
              <div className='main-page-text'>
                4. <span className="italics">(Optional)</span> Add any extra details you'd like highlighted in the message
              </div>
            </div>
            {!error && <button className="action-button" onClick={getResponse}>Generate</button>}
            {error && <button className="action-button" onClick={clear}>Clear</button>}
            {error && <p>{error}</p>}
          </div>
        </>
      ) : (
        <>
          <LeftColumn 
            value={value}
            setValue={setValue}
            name={name}
            setName={setName}
            recipientInfo={recipientInfo}
            setrecipientInfo={setrecipientInfo}
            additionalInfo={additionalInfo}
            setInfo={setInfo}
          />
          <div className="column-right info-text">
            <div className="response-columns">
              <div className="column-left-inner">
                {chatHistory.filter(chatItem => chatItem.role === "model").slice(-2, -1).map((chatItem, _index) => (
                  <div key={_index} className="response-box">
                    <p className="answer">{chatItem.parts[0].text}</p>
                  </div>
                ))}
              </div>
              <div className="column-right-inner">
                {chatHistory.filter(chatItem => chatItem.role === "model").slice(-1).map((chatItem, _index) => (
                  <div key={_index} className="response-box">
                    <p className="answer">{chatItem.parts[0].text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="buttons">
                {!error && <button className="action-button" onClick={getResponse}>Generate</button>}
                <button className="action-button" onClick={clear}>Clear</button>
              </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

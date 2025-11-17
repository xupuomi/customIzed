import React, { useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import './index.css';
import main from './assets/main-logo.png';
import LeftColumn from './LeftColumn.jsx';

const App = () => {
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [recipientInfo, setrecipientInfo] = useState("");
  const [additionalInfo, setInfo] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showResponses, setShowResponses] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [websiteURL, setWebsiteURL] = useState("");


  const getResponse = async (isRegeneration = false) => {
    if ((!value || !name || !recipientInfo) && !isRegeneration) {
      setError("Error! Please enter all required fields!");
      return;
    }

    try {
      setLoading(true);
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value,
          name: name,
          recipientInfo: recipientInfo,
          additionalInfo: additionalInfo,
          websiteURL: websiteURL,
          selectedResponse: selectedResponse
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
      setSelectedResponse(null);
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResponseClick = (index) => {
    setSelectedResponse(index);
  };

  const clear = () => {
    setValue("");
    setrecipientInfo("");
    setName("");
    setError("");
    setInfo("");
    setChatHistory([]);
    setShowResponses(false);
    setSelectedResponse(null);
  };

  return (
    <div className="container">
      <LeftColumn
        value={value}
        setValue={setValue}
        name={name}
        setName={setName}
        recipientInfo={recipientInfo}
        setrecipientInfo={setrecipientInfo}
        additionalInfo={additionalInfo}
        setInfo={setInfo}
        websiteURL = {websiteURL}
        setWebsiteURL={setWebsiteURL}
      />
      {!showResponses ? (
        <>
          <div className="column-right info-text">
            <img src={main} alt="main title" style={{ width: '530px', height: 'auto' }} />
            {!loading ? (
              <>
                <div className='title-text-section'>
                  <div className='main-page-text'>
                    1. Paste your email template and insert prompts such as <span className="ui-bold">[select sponsorship benefits that are well suited for the company]</span>
                    where you need customization
                  </div>
                  <div className='main-page-text'>
                    2. Enter the recipient's name
                  </div>
                  <div className='main-page-text'>
                    3. Enter company name
                  </div>
                  <div className='main-page-text'>
                    4. Enter company website url
                  </div>
                  <div className='main-page-text'>
                    4. <span className="ui-italics">(Optional)</span> Add any extra details you'd like highlighted in the message, such as a list of possible sponsorship benefits
                  </div>
                </div>
                <div className='buttons'>
                {<button className="action-button" onClick={() => getResponse()}>Generate</button>}
                {<button className="action-button" onClick={clear}>Clear</button>}
                
                </div> 
                {error && <div className='extra-text'>{error}</div>}
              </>
            ) : (
              <div className="loading">Loading...</div>
            )}
          </div>

        </>
      ) : (
        <>
          <div className="column-right">
            {!loading ? (
              <>
                <div className="response-columns">
                  {chatHistory.filter(chatItem => chatItem.role === "model").slice(-2).map((chatItem, index) => (
                    <div
                      key={index}
                      className={`response-box ${selectedResponse === index ? 'selected' : ''}`}
                      onClick={() => handleResponseClick(index)}
                    >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                    >
                      {chatItem.parts[0].text}
                    </ReactMarkdown>


                    </div>
                  ))}
                </div>
                <div className='extra-text'>
                  If you find a response you like, select it and click "Regenerate" to generate two new, similar responses.
                </div>
                <div className="buttons">
                  {!error && <button className="action-button" onClick={() => getResponse(true)}>Regenerate</button>}
                  <button className="action-button" onClick={clear}>Clear</button>
                </div>
              </>
            ) : (
              <div className="loading">Loading...</div>
            )}

          </div>
        </>
      )}
    </div>
  );
};

export default App;



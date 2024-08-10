// LeftColumn.js
import React from 'react';
import logo from './pencil.png';

const LeftColumn = ({ value, setValue, name, setName, recipientInfo, setrecipientInfo, additionalInfo, setInfo }) => {
  return (
    <div className="column-left text-boxes">
      <div className="heading">
        <img src={logo} alt="logo" style={{ width: '40px', height: 'auto'}}/>
        <div className="heading">customIzed</div>
      </div>
      <div className="box-label">Email Template<span style={{ color: 'red' }}>*</span></div>
      <textarea
        className="textarea"
        value={value}
        placeholder="Type here"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="box-label">Recipient Name and Role<span style={{ color: 'red' }}>*</span></div>
      <textarea
        className="textarea url"
        value={name}
        placeholder="Type here"
        onChange={(e) => setName(e.target.value)}
      />
      <div className="box-label">Recipient Info<span style={{ color: 'red' }}>*</span></div>
      <textarea
        className="textarea small-textarea"
        value={recipientInfo}
        placeholder="Type here"
        onChange={(e) => setrecipientInfo(e.target.value)}
      />
      <div className="box-label">Purpose of Email/Additional Info</div>
      <textarea
        className="textarea small-textarea"
        value={additionalInfo}
        placeholder="Type here"
        onChange={(e) => setInfo(e.target.value)}
      />
    </div>
  );
};

export default LeftColumn;

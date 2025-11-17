import React from 'react';
import logo from './assets/pencil.png';

const LeftColumn = ({
  value, setValue,
  name, setName,
  recipientInfo, setrecipientInfo,
  additionalInfo, setInfo,
  websiteURL, setWebsiteURL
}) => {
  return (
    <div className="column-left text-boxes">
      <div className="heading">
        <img src={logo} alt="logo" style={{ width: "40px" }} />
        <div className="heading">customIzed</div>
      </div>

      <div className="box-label">Email Template<span style={{color:"red"}}>*</span></div>
      <textarea className="textarea large-textarea" value={value} onChange={(e)=>setValue(e.target.value)} />

      <div className="box-label">Recipient Name<span style={{color:"red"}}>*</span></div>
      <textarea className="textarea small-textarea" value={name} onChange={(e)=>setName(e.target.value)} />

      <div className="box-label">Company Name<span style={{color:"red"}}>*</span></div>
      <textarea className="textarea small-textarea" value={recipientInfo} onChange={(e)=>setrecipientInfo(e.target.value)} />

      <div className="box-label">Company Website URL<span style={{color:"red"}}>*</span></div>
      <textarea className="textarea small-textarea" value={websiteURL} onChange={(e)=>setWebsiteURL(e.target.value)} />

      <div className="box-label">Additional Info</div>
      <textarea className="textarea med-textarea" value={additionalInfo} onChange={(e)=>setInfo(e.target.value)} />
    </div>
  );
};

export default LeftColumn;

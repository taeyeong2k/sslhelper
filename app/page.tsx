'use client';
import React, { useState } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme, TextArea, Button, Flex } from '@radix-ui/themes';
import Buttons from '../components/Buttons';
export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedButton, setSelectedButton] = useState('Select an option');
  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setInputText(e.target.value);

  async function submitForm() {
    // Check that a button has been selected
    if (selectedButton === 'Select an option') {
      setOutputText('Please select an option');
      return;
    }
    console.log("Submitting form...");  
    const data = inputText.trim();
    const response = await fetch('/api/submitForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'requestType': selectedButton, 'input': data }),
    });
  
    const result = await response.json();
    console.log("Server response:", result.output);  
  
    setOutputText(result.output || "No message received");  
  }
  
  const handleButtonClick = (buttonName: React.SetStateAction<string>) => setSelectedButton(buttonName);
  const buttonInstructions: { [key: string]: string | undefined } ={
    'Check Domain': 'Enter domain name (e.g. google.com)',
    'CSR Decoder': 'Enter CSR request to decode',
    'SSL Certificate Decoder': 'Enter SSL certificate to decode',
    'Certificate Key Matcher': 'Enter SSL certificate and key to match',
    'Verify Certificate Chain': 'Enter SSL certificate chain to verify',
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Theme>
        <header className="text-center w-full mb-12">
          <h1 className="text-4xl font-bold">SSLHelper</h1>
          <p className="text-sm mt-2">
            If there are any issues/questions, please contact Tae Kim. <br />
            For internal use only.
          </p>
        </header>
        <div className="mb-8">
          <Buttons selectedButton={selectedButton} handleButtonClick={handleButtonClick} />
        </div>
         {/* Display the name of the clicked button */}
        {selectedButton && <div className="mb-5">{buttonInstructions[selectedButton] || selectedButton}</div>}

        <TextArea placeholder="Input value..." value={inputText} onChange={handleInputChange} />
        <div className="text-center mt-5">
          <Button size="3" variant="classic" onClick={submitForm}>Submit</Button>
        </div>

        {/* Display the output text */}
        {outputText && <div className="mt-5">{outputText}</div>}
        
      </Theme>
    </main>
  )
}

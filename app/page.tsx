'use client';
import React, { useState } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme, TextArea, Button } from '@radix-ui/themes';
import Buttons from '../components/Buttons';
export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [keyText, setKeyText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [csrText, setCsrText] = useState('');

  const [selectedButton, setSelectedButton] = useState('Select an option');
  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setInputText(e.target.value);
  const handleKey = (e: { target: { value: React.SetStateAction<string>; }; }) => setKeyText(e.target.value)
  const handleCheckBox = (e: { target: { checked: boolean; }; }) => setIsChecked(e.target.checked);
  const handleCsr = (e: { target: { value: React.SetStateAction<string>; }; }) => setCsrText(e.target.value);
  async function submitForm() {
    // Check that a button has been selected
    if (selectedButton === 'Select an option') {
      setOutputText('Please select an option');
      return;
    }
    console.log("Submitting form...");
    console.log("Selected button:", selectedButton);
    const data = inputText.trim();

    // Define payload with a type that allows input to be either a string or an object
    let payload: { requestType: string, input: string | { cert: string, key: string } | { cert: string, key: string, csr: string}} = {
      'requestType': selectedButton,
      'input': data
    };

    if (selectedButton === 'Certificate Key Matcher') {
      if (isChecked) {
        const csr = csrText.trim();
        const key = keyText.trim();
        const csrJson = { 'cert': data, 'key': key, 'csr': csr };
        payload.input = csrJson;  
      }
      else {
        const key = keyText.trim();
        const csr = ''
        const dataJson = { 'cert': data, 'key': key, 'csr': csr };
        payload.input = dataJson;  
      }
    }

    const response = await fetch('/api/submitForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    const result = await response.json();
    console.log("Server response:", result.output);  
  
    setOutputText(result.output || "Something went wrong, please double check your input and try again");  
  }
  const handleButtonClick = (buttonName: React.SetStateAction<string>) => {
    // Set the selected button
    setSelectedButton(buttonName);

    // Reset the input and output to their initial values
    setInputText('');  // Resets inputText to an empty string
    setOutputText(''); // Resets outputText to an empty string
    setKeyText('') 
    setCsrText('')
    setIsChecked(false)
  };

  const buttonInstructions: { [key: string]: string | undefined } ={
    'Check Domain': 'Enter domain name (e.g. google.com)',
    'CSR Decoder': 'Enter CSR to decode',
    'SSL Certificate Decoder': 'Enter SSL certificate to decode',
    'Certificate Key Matcher': 'Enter SSL certificate',
    'Verify Certificate Chain': 'Enter SSL certificate chain to verify',
  }

  return (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div className="flex flex-col items-center w-full max-w-screen-lg">
      <Theme>
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">SSLHelper</h1>
          <p className="text-sm mt-2 mb-12">
            If there are any issues/questions, please contact Tae Kim. <br />
            For internal use only.
          </p>
          <Buttons selectedButton={selectedButton} handleButtonClick={handleButtonClick} />
        </header>

        {selectedButton && 
          <div className="mb-5">
            {buttonInstructions[selectedButton] || selectedButton}
          </div>
        }

        {selectedButton === 'Certificate Key Matcher' ? (
          <label>
            <input 
              className ="mr-2"
              type="checkbox" 
              checked={isChecked} 
              onChange={handleCheckBox}
            />
            Also match CSR? 
          </label>
        ) : null}
        <TextArea
          className={`w-full ${selectedButton !== 'Check Domain' && selectedButton !== 'Select an option' ? 'h-[250px]' : 'h-[50px]'}`}
          placeholder="Input value..."
          value={inputText}
          onChange={handleInputChange}
        />
        
        {selectedButton === 'Certificate Key Matcher' ? (
          <div className="mb-3 mt-5">Enter key to match</div>
            ) : null}
        {selectedButton === 'Certificate Key Matcher' ? (
          <TextArea
            className="w-full h-[250px] mt-2"
            placeholder="Input value..."
            value={keyText}
            onChange={handleKey}
          />
            ) : null}

        {selectedButton === 'Certificate Key Matcher' && isChecked ? (
          <div className="mb-3 mt-5">Enter CSR to match</div>
            ) : null}
        {selectedButton === 'Certificate Key Matcher'  && isChecked? (
          <TextArea
            className="w-full h-[250px] mt-2"
            placeholder="Input value..."
            value={csrText}
            onChange={handleCsr}
          />
        ) : null}

        <div className="text-center mb-5 mt-5">
          <Button size="3" variant="classic" onClick={submitForm}>Submit</Button>
        </div>


      {/* Output Text */}
      <div className="relative">
        <pre className="whitespace-pre-wrap break-words max-w-[805px] px-2 overflow-x-auto">
          {outputText}
        </pre>
      </div>

      </Theme>
    </div>
  </main>
)

}

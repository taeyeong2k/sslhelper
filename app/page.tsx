'use client';
import React, { useState } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme, TextArea, Button, Flex } from '@radix-ui/themes';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedButton, setSelectedButton] = useState('Select an option');
  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setInputText(e.target.value);
  const handleSubmit = () => setOutputText(inputText);
  const handleButtonClick = (buttonName: React.SetStateAction<string>) => setSelectedButton(buttonName);


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
          
        <Flex gap="3" align="center" >
          <Button size="3" variant="soft" onClick={() => handleButtonClick('Check Domain')}>Check Domain</Button>
          <Button size="3" variant="soft" onClick={() => handleButtonClick('CSR Decoder')}>CSR Decoder</Button>
          <Button size="3" variant="soft" onClick={() => handleButtonClick('SSL Certificate Decoder')}>SSL Certificate Decoder</Button>
          <Button size="3" variant="soft" onClick={() => handleButtonClick('Certificate Key Matcher')}>Certificate Key Matcher</Button>
          <Button size="3" variant="soft" onClick={() => handleButtonClick('Verify Certificate Chain')}>Verify Certificate Chain</Button>
        </Flex>
        </div>
         {/* Display the name of the clicked button */}
        {selectedButton && <div className="mb-5">{selectedButton}</div>}

        <TextArea placeholder="Reply to comment…" value={inputText} onChange={handleInputChange} />
        <div className="text-center mt-5">
          <Button size="3" variant="classic" onClick={handleSubmit}>Submit</Button>
        </div>

        {/* Display the output text */}
        {outputText && <div className="mt-5">{outputText}</div>}
        
      </Theme>
    </main>
  )
}

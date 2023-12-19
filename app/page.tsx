"use client";
import React, { useState } from "react";
import "@radix-ui/themes/styles.css";
import { Theme, TextArea, Button } from "@radix-ui/themes";
import Buttons from "../components/Buttons";
import CheckboxGroup from "@/components/CheckboxGroup";
import TextAreaInput from "@/components/TextAreaInput";
import SubmitButton from "@/components/SubmitButton";


export default function Home() {
  // Set up state for inputs and outputs
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [keyText, setKeyText] = useState("");
  const [matchAll, setMatchAll] = useState(false);
  const [matchCsrKey, setMatchCsrKey] = useState(false);
  const [csrText, setCsrText] = useState("");
  const [selectedButton, setSelectedButton] = useState("Select an option");

  // Handle input changes
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setInputText(e.target.value);
  const handleKey = (e: { target: { value: React.SetStateAction<string> } }) =>
    setKeyText(e.target.value);
  const handleAllCheckBox = (e: { target: { checked: boolean } }) => {
    setMatchAll(e.target.checked);
    if (e.target.checked) {
      setMatchCsrKey(false); // Uncheck matchCsrKey if matchAll is checked
    }
  };

  const handleCsrKeyCheckbox = (e: { target: { checked: boolean } }) => {
    setMatchCsrKey(e.target.checked);
    setInputText("");
    if (e.target.checked) {
      setMatchAll(false); // Uncheck matchAll if matchCsrKey is checked
    }
  };

  const handleCsr = (e: { target: { value: React.SetStateAction<string> } }) =>
    setCsrText(e.target.value);

  // Submit form and send to server
  async function submitForm() {
    // Check that a button has been selected
    if (selectedButton === "Select an option") {
      setOutputText("Please select an option");
      return;
    }
    console.log("Submitting form...");
    console.log("Selected button:", selectedButton);
    const data = inputText.trim();

    // Define payload with a type that allows input to be either a string or an object
    let payload: {
      requestType: string;
      input:
        | string
        | { cert: string; key: string }
        | { cert: string; key: string; csr: string };
    } = {
      requestType: selectedButton,
      input: data,
    };

    if (selectedButton === "Certificate Key Matcher") {
      if (matchAll) {
        const csr = csrText.trim();
        const key = keyText.trim();
        const csrJson = { cert: data, key: key, csr: csr };
        payload.input = csrJson;
      } else if (matchCsrKey) {
        const key = keyText.trim();
        const csrJson = { cert: "", key: key, csr: data };
        payload.input = csrJson;
      } else {
        const key = keyText.trim();
        const csr = "";
        const dataJson = { cert: data, key: key, csr: csr };
        payload.input = dataJson;
      }
    }

    // Send payload to server
    const response = await fetch("/api/submitForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Get response from server
    const result = await response.json();
    console.log("Server response:", result.output);

    // Update output text
    setOutputText(
      result.output ||
        "Something went wrong, please double check your input and try again"
    );
  }

  // Handle button clicks
  const handleButtonClick = (buttonName: React.SetStateAction<string>) => {
    // Set the selected button
    setSelectedButton(buttonName);

    // Reset the input and output to their initial values
    setInputText(""); // Resets inputText to an empty string
    setOutputText(""); // Resets outputText to an empty string
    setKeyText("");
    setCsrText("");
    setMatchAll(false);
    setMatchCsrKey(false);
  };

  const buttonInstructions: { [key: string]: string | undefined } = {
    "Check Domain": "Enter domain name (e.g. google.com)",
    "CSR Decoder": "Enter CSR to decode",
    "CSR Generator": "Enter CSR information",
    "SSL Certificate Decoder": "Enter SSL certificate to decode",
    "Certificate Key Matcher": matchCsrKey
      ? "Enter CSR to match"
      : "Enter SSL certificate",
    "Verify Certificate Chain": "Enter SSL certificate chain to verify",
  };

  // Main page
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
            <Buttons
              selectedButton={selectedButton}
              handleButtonClick={handleButtonClick}
            />
          </header>

          {/* Display button instructions */}
          {selectedButton && (
            <div className="mb-5">
              {buttonInstructions[selectedButton] || selectedButton}
            </div>
          )}

          {/* Display checkboxes for cert-key-csr matcher */}
          {selectedButton === "Certificate Key Matcher" ? (
            <CheckboxGroup
              matchAll={matchAll}
              handleAllCheckBox={handleAllCheckBox}
              matchCsrKey={matchCsrKey}
              handleCsrKeyCheckbox={handleCsrKeyCheckbox}
            />
          ) : null}

          {/* Input Text Form*/}
          <TextAreaInput
            selectedButton={selectedButton}
            value={inputText}
            onChange={handleInputChange}
            placeholder="Input value..."
          />

          {/* Extra fields for cert key matcher */}
          {selectedButton === "Certificate Key Matcher" ? (
            <div className="mb-3 mt-5">Enter key to match</div>
          ) : null}
          {selectedButton === "Certificate Key Matcher" ? (
            <TextAreaInput
              selectedButton={selectedButton}
              value={keyText}
              onChange={handleKey}
              placeholder="Input value..."
            />
          ) : null}

          {selectedButton === "Certificate Key Matcher" && matchAll ? (
            <div className="mb-3 mt-5">Enter CSR to match</div>
          ) : null}
          {selectedButton === "Certificate Key Matcher" && matchAll ? (
            <TextAreaInput
              selectedButton={selectedButton}
              value={csrText}
              onChange={handleCsr}
              placeholder="Input value..."
            />
          ) : null}

          {/* Submit Button */}
          <div className="text-center mb-5 mt-5">
            <SubmitButton onClick={submitForm} />
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
  );
}

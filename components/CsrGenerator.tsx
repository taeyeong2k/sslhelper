// CSRGenerator.tsx

import React, { useState } from "react";
import { Flex, TextArea } from "@radix-ui/themes";
import SubmitButton from "./SubmitButton";

// Callback function 
interface CsrGeneratorProps {
    onCsrGenerated: (output: string) => void;
}
const CSRGenerator: React.FC<CsrGeneratorProps> = ({ onCsrGenerated }) => {
  const [commonName, setCommonName] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationalUnit, setOrganizationalUnit] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("Generating CSR with:", {
      commonName,
      organization,
      organizationalUnit,
      country,
      state,
      location,
      email,
    });
    onCsrGenerated("CSR generated successfully: " + commonName + " " + organization + " " + organizationalUnit + " " + country + " " + state + " " + location + " " + email );
    // CSR generation logic goes here
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="3">
        <label>
          Common Name (CN):
          <TextArea
            value={commonName}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setCommonName(e.target.value)}
          />
        </label>
        <label>
          Organization (O):
          <TextArea
            value={organization}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setOrganization(e.target.value)}
          />
        </label>
        <label>
          Organizational Unit (OU) (Optional):
          <TextArea
            value={organizationalUnit}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setOrganizationalUnit(e.target.value)}
          />
        </label>
        <label>
          Country (2 letter code) (C):
          <TextArea
            value={country}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setCountry(e.target.value)}
          />
        </label>
        <label>
          State or Province Name spelled out (ST):
          <TextArea
            value={state}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setState(e.target.value)}
          />
        </label>
        <label>
          Location - City name spelled out (L):
          <TextArea
            value={location}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setLocation(e.target.value)}
          />
        </label>
        <label>
          Email:
          <TextArea
            value={email}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setEmail(e.target.value)}
          />
        </label>
        <SubmitButton onClick={handleSubmit} />
      </Flex>
    </form>
  );
};

export default CSRGenerator;

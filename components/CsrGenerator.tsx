// CSRGenerator.tsx

import React, { useState } from 'react';
import { Flex, TextArea} from "@radix-ui/themes";

const CSRGenerator = () => {
  const [commonName, setCommonName] = useState('');
  const [organization, setOrganization] = useState('');
  const [organizationalUnit, setOrganizationalUnit] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating CSR with:', { commonName, organization, organizationalUnit, country, state, email });
    // CSR generation logic goes here
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="3">
        <label>
          Common Name (CN):
          <TextArea value={commonName} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCommonName(e.target.value)} />
        </label>
        <label>
          Organization (O):
          <TextArea value={organization} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setOrganization(e.target.value)} />
        </label>
        <label>
          Organizational Unit (OU):
          <TextArea value={organizationalUnit} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setOrganizationalUnit(e.target.value)} />
        </label>
        <label>
          Country (C):
          <TextArea value={country} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCountry(e.target.value)} />
        </label>
        <label>
          State (ST):
          <TextArea value={state} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setState(e.target.value)} />
        </label>
        <label>
          Email:
          <TextArea value={email} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)} />
        </label>
      </Flex>
    </form>
  );
};

export default CSRGenerator;

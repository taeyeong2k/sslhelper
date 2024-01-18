import React, { useState } from "react";
import { Flex, TextArea } from "@radix-ui/themes";
import SubmitButton from "./SubmitButton";
import { CsrData } from "../app/utils/types";

interface CsrGeneratorProps {
  onCsrGenerated: (output: string) => void;
}

const CSRGenerator: React.FC<CsrGeneratorProps> = ({ onCsrGenerated }) => {
  const [csrData, setCsrData] = useState<CsrData>({
    commonName: "",
    organization: "",
    organizationalUnit: "",
    country: "",
    state: "",
    location: "",
    email: "",
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    console.log("Generating CSR with:", csrData);

    try {
      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(csrData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result.output);

      onCsrGenerated(result.output || "CSR generated successfully.");
    } catch (error) {
      console.error("CSR generation error:", error);
      onCsrGenerated("Failed to generate CSR. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof CsrData
  ) => {
    setCsrData({ ...csrData, [field]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="3">
        <label>
          Country (C), 2 letter country code:
          <TextArea
            value={csrData.country}
            onChange={(e) => handleChange(e, "country")}
          />
        </label>
        <label>
          State (ST):
          <TextArea
            value={csrData.state}
            onChange={(e) => handleChange(e, "state")}
          />
        </label>
        <label>
          Location (L):
          <TextArea
            value={csrData.location}
            onChange={(e) => handleChange(e, "location")}
          />
        </label>
        <label>
          Organization (O):
          <TextArea
            value={csrData.organization}
            onChange={(e) => handleChange(e, "organization")}
          />
        </label>
        <label>
          Organizational Unit (OU):
          <TextArea
            value={csrData.organizationalUnit}
            onChange={(e) => handleChange(e, "organizationalUnit")}
          />
        </label>
        <label>
          Common Name (CN), Separated by commas, spaces or new lines:
          <TextArea
            value={csrData.commonName}
            onChange={(e) => handleChange(e, "commonName")}
          />
        </label>
        <label>
          Email:
          <TextArea
            value={csrData.email}
            onChange={(e) => handleChange(e, "email")}
          />
        </label>
        <div className="text-center mb-5 mt-5">
          <SubmitButton onClick={handleSubmit} />
        </div>
      </Flex>
    </form>
  );
};

export default CSRGenerator;

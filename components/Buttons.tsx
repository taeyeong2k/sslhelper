import React from "react";
import { Button, Flex } from "@radix-ui/themes";

interface Props {
  selectedButton: string;
  handleButtonClick: (buttonName: string) => void;
}

const Buttons: React.FC<Props> = ({ selectedButton, handleButtonClick }) => (
  <Flex gap="3" align="center">
    <Button
      size="3"
      variant={selectedButton === "Check Domain" ? "solid" : "soft"}
      onClick={() => handleButtonClick("Check Domain")}
    >
      Check Domain
    </Button>

    <Button
      size="3"
      variant={selectedButton === "CSR Decoder" ? "solid" : "soft"}
      onClick={() => handleButtonClick("CSR Decoder")}
    >
      CSR Decoder
    </Button>
    <Button
      size="3"
      variant={selectedButton === "CSR Generator" ? "solid" : "soft"}
      onClick={() => handleButtonClick("CSR Generator")}
      >
      CSR Generator
    </Button>
    <Button
      size="3"
      variant={selectedButton === "SSL Certificate Decoder" ? "solid" : "soft"}
      onClick={() => handleButtonClick("SSL Certificate Decoder")}
    >
      SSL Certificate Decoder
    </Button>
    <Button
      size="3"
      variant={selectedButton === "Certificate Key Matcher" ? "solid" : "soft"}
      onClick={() => handleButtonClick("Certificate Key Matcher")}
    >
      Certificate Key Matcher
    </Button>
    <Button
      size="3"
      variant={selectedButton === "Verify Certificate Chain" ? "solid" : "soft"}
      onClick={() => handleButtonClick("Verify Certificate Chain")}
    >
      Verify Certificate Chain
    </Button>
  </Flex>
);

export default Buttons;

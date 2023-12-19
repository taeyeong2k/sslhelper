import React from "react";
import { Button } from "@radix-ui/themes";

interface SubmitButtonProps {
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => (
  <Button size="3" variant="classic" onClick={onClick}>
    Submit
  </Button>
);

export default SubmitButton;

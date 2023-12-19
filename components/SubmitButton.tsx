import React from 'react';
import { Button as RadixButton } from "@radix-ui/themes";

interface SubmitButtonProps {
  onClick: (e?: React.FormEvent) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => (
  <RadixButton size="3" variant="classic" onClick={(e) => onClick(e)}>
    Submit
  </RadixButton>
);

export default SubmitButton;

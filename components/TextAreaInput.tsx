// TextAreaInput.tsx

import React from "react";
import { TextArea as RadixTextArea } from "@radix-ui/themes";

interface TextAreaInputProps {
  selectedButton: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  selectedButton,
  value,
  onChange,
  placeholder,
}) => {
  const textAreaHeight =
    selectedButton !== "Check Domain" && selectedButton !== "Select an option"
      ? "h-[250px]"
      : "h-[50px]";

  return (
    <RadixTextArea
      className={`w-full ${textAreaHeight}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default TextAreaInput;

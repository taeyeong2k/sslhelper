// OutputDisplay.tsx

import React from "react";

interface OutputDisplayProps {
  outputText: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ outputText }) => (
  <div className="relative">
    <pre className="whitespace-pre-wrap break-words max-w-[805px] px-2 overflow-x-auto">
      {outputText}
    </pre>
  </div>
);

export default OutputDisplay;

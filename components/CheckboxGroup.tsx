// CheckboxGroup.tsx

import React, { ChangeEvent } from "react";
import { Flex } from "@radix-ui/themes";

interface CheckboxGroupProps {
  matchAll: boolean;
  handleAllCheckBox: (e: ChangeEvent<HTMLInputElement>) => void;
  matchCsrKey: boolean;
  handleCsrKeyCheckbox: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  matchAll,
  handleAllCheckBox,
  matchCsrKey,
  handleCsrKeyCheckbox,
}) => (
  <Flex gap="3" align="center">
    <label>
      <input
        type="checkbox"
        className="mr-2"
        checked={matchAll}
        onChange={handleAllCheckBox}
      />
      Also match CSR?
    </label>
    <label>
      <input
        className="mr-2"
        type="checkbox"
        checked={matchCsrKey}
        onChange={handleCsrKeyCheckbox}
      />
      Match CSR and key only
    </label>
  </Flex>
);

export default CheckboxGroup;

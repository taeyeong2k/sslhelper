const { exec } = require("child_process");
const { promisify } = require("util");
import { CsrData } from "@/app/utils/types";
export function generateCsr(input: CsrData) {
  return "Test";
}
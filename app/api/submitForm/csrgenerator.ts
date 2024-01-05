const { exec } = require("child_process");
const { promisify } = require("util");
import { CsrData } from "@/app/utils/types";
import os from "os";
import path from "path";
import fs from "fs";
const execAsync = promisify(exec);
export function generateCsr(input: CsrData) {
  console.log("input", input);
  return "Test";
}
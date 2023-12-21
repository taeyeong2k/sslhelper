const { exec } = require("child_process");
const { promisify } = require("util");
import os from "os";
import path from "path";
import fs from "fs";
const execAsync = promisify(exec);
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const data = await req.json();
}

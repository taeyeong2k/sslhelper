import { NextRequest, NextResponse } from 'next/server';
import { checkDomain } from './sslhelper';

const sampleFunction = (str: string) => str.toUpperCase();

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const input = data.input;
  const requestType = data.requestType;
  console.log(requestType, input)

  switch (requestType) {
    case 'Check Domain':
      console.log(`Checking domain ${input}`)
      const output = await checkDomain(input);
      console.log(output)
      return NextResponse.json({ output: output });
    case 'CSR Decoder':
      console.log(`Decoding CSR ${input}`)
      return NextResponse.json({ output: sampleFunction(input) });
    case 'SSL Certificate Decoder':
      console.log(`Decoding SSL Certificate ${input}`)
      return NextResponse.json({ output: sampleFunction(input) });
    case 'Certificate Key Matcher':
      console.log(`Matching certificate key ${input}`)
      return NextResponse.json({ output: sampleFunction(input) });
    case 'Verify Certificate Chain':
      console.log(`Verifying certificate chain ${input}`)
      return NextResponse.json({ output: sampleFunction(input) });
    default:
      return NextResponse.json({ output: 'Invalid request type' });
}}

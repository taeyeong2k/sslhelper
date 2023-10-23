import { NextRequest, NextResponse } from 'next/server';
import { checkDomain, csrDecode, sslCertificateDecode } from './sslhelper';

const sampleFunction = (str: string) => str.toUpperCase();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const input = data.input;
  const requestType = data.requestType;
  console.log(requestType, input)

  switch (requestType) {
    case 'Check Domain':
      console.log(`Checking domain ${input}`)
      const checkDomainOutput = await checkDomain(input);
      console.log(checkDomainOutput)
      return NextResponse.json({ output: checkDomainOutput });
    case 'CSR Decoder':
      console.log(`Decoding CSR ${input}`)
      const csrDecoderOutput = await csrDecode(input);
      return NextResponse.json({ output: csrDecoderOutput});
    case 'SSL Certificate Decoder':
      console.log(`Decoding SSL Certificate ${input}`)
      return NextResponse.json({ output: sslCertificateDecode(input) });
    case 'Certificate Key Matcher':
      console.log(`Matching certificate key ${input}`)
      return NextResponse.json({ output: sampleFunction(input) });
    case 'Verify Certificate Chain':
      console.log(`Verifying certificate chain ${input}`)
      return NextResponse.json({ output: sampleFunction(input) });
    default:
      return NextResponse.json({ output: 'Invalid request type' });
}}

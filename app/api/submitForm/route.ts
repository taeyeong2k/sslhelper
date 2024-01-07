import { NextRequest, NextResponse } from "next/server";
import {
  checkDomain,
  csrDecode,
  decodeSslCertificate,
  certificateKeyMatcher,
  verifyCertificateChain,
} from "./sslhelper";

import {
  formatCheckDomainCommand,
  formatCsrDecodeCommand,
} from "../../utils/formatHelper";

import {
  generateCsr,
} from "./csrgenerator";


export async function POST(req: NextRequest) {
  console.log("test");
  const data = await req.json();
  const input = data.input;
  const requestType = data.requestType;
  console.log(requestType, input);
  if (process.env.VERCEL === "1") {
    switch (requestType) {
      case "Check Domain":
        console.log(`Checking domain ${input}`);
        const checkDomainCommand = formatCheckDomainCommand(input);
        console.log(checkDomainCommand);
        return NextResponse.json({ output: checkDomainCommand });
      case "CSR Decoder":
        console.log(`Decoding CSR ${input}`);
        const command = await formatCsrDecodeCommand(input);
        return NextResponse.json({ output: command });
      default:
        return NextResponse.json({
          output: "OpenSSL is not available on Vercel, WIP",
        });
    }
  } else {
    switch (requestType) {
      case "Check Domain":
        console.log(`Checking domain ${input}`);
        const checkDomainOutput = await checkDomain(input);
        console.log(checkDomainOutput);
        return NextResponse.json({ output: checkDomainOutput });
      case "CSR Decoder":
        console.log(`Decoding CSR ${input}`);
        const csrDecoderOutput = await csrDecode(input);
        return NextResponse.json({ output: csrDecoderOutput });
      case "SSL Certificate Decoder":
        console.log(`Decoding SSL Certificate ${input}`);
        const sslCertificateDecoderOutput = await decodeSslCertificate(input);
        return NextResponse.json({ output: sslCertificateDecoderOutput });
      case "Certificate Key Matcher":
        console.log(`Matching certificate key`);
        const certKeyMatcherOutput = await certificateKeyMatcher(
          input.cert,
          input.key,
          input.csr,
        );
        return NextResponse.json({ output: certKeyMatcherOutput });
      case "Verify Certificate Chain":
        console.log(`Verifying certificate chain ${input}`);
        const verifyCertChainOutput = await verifyCertificateChain(input);
        return NextResponse.json({ output: verifyCertChainOutput });
      default:
        console.log("CSR Generator");
        const csrGeneratorOutput = await generateCsr(data);
        return NextResponse.json({ output: csrGeneratorOutput });
    }
  }
}

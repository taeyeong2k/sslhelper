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
  const data = await req.json();
  const input = data.input || "";
  const requestType = data.requestType || "CSR Generator";
  console.log(requestType, input);
  if (process.env.VERCEL === "1") {
    switch (requestType) {
      case "Check Domain":
        const checkDomainCommand = formatCheckDomainCommand(input);
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
        const checkDomainOutput = await checkDomain(input);
        return NextResponse.json({ output: checkDomainOutput });
      case "CSR Decoder":
        const csrDecoderOutput = await csrDecode(input);
        return NextResponse.json({ output: csrDecoderOutput });
      case "SSL Certificate Decoder":
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
        const verifyCertChainOutput = await verifyCertificateChain(input);
        return NextResponse.json({ output: verifyCertChainOutput });
      case "CSR Generator":
        const csrGeneratorOutput = await generateCsr(data);
        return NextResponse.json({ output: csrGeneratorOutput });
      default:
        return NextResponse.json({ output: "Unknown request type" });
    }
  }
}

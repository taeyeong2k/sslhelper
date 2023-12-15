import { NextRequest, NextResponse } from "next/server";
import {
  checkDomain,
  csrDecode,
  decodeSslCertificate,
  certificateKeyMatcher,
  verifyCertificateChain,
} from "./sslhelper";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const input = data.input;
  const requestType = data.requestType;
  console.log(requestType, input);
  if (process.env.VERCEL === "1") {
    return "OpenSSL is not available on Vercel, WIP";
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
          input.csr
        );
        return NextResponse.json({ output: certKeyMatcherOutput });
      case "Verify Certificate Chain":
        console.log(`Verifying certificate chain ${input}`);
        const verifyCertChainOutput = await verifyCertificateChain(input);
        return NextResponse.json({ output: verifyCertChainOutput });
      default:
        return NextResponse.json({ output: "Invalid request type" });
    }
  }
}

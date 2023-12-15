const { exec } = require("child_process");
const { promisify } = require("util");
import os from "os";
import path from "path";
import fs from "fs";
const execAsync = promisify(exec);
const { formatOutput } = require("../../utils/formatHelper.ts");
const openssl = require("openssl-nodejs");
const fetchSslInfo = async (domain: string) => {
  try {
    const command = `echo | openssl s_client -connect ${domain}:443 -servername ${domain} 2>/dev/null | openssl x509 -noout -text`;
    const { stdout, stderr } = await execAsync(command);

    openssl(`openssl s_client -connect ${domain}:443 -servername ${domain}`, function (err: string, buffer: string) {
      if (err) {
        console.log(err);
      }
      console.log("Buffer ---------------------\n" + buffer);
    });


    if (stderr) {
      console.error(`An error occurred: ${stderr}`);
      return;
    }

    console.log(stdout);

    const formattedOutput = formatOutput(stdout);
    console.log("Formatted output: " + formattedOutput);

    // get ip
    const ipCommand = `dig +short ${domain}`;

    // prepend ip to stdout
    const ip = await execAsync(ipCommand);
    const output = `${domain} resolves to ${ip.stdout}${formattedOutput}`;
    console.log("IP Address: " + ip.stdout);
    console.log("SSL Certificate Information:\n");
    return output;
  } catch (e) {
    console.error(`An exception occurred: ${e}`);
  }
};

export const csrDecode = async (csr: string) => {
  // Create a temporary file in the system's temp directory
  const tempFilePath = path.join(os.tmpdir(), `temp_csr_${Date.now()}.pem`);

  // Write the CSR to the temporary file
  fs.writeFileSync(tempFilePath, csr);

  // Run the OpenSSL command
  const command = `openssl req -in ${tempFilePath} -noout -text`;
  const { stdout, stderr } = await execAsync(command);

  // Remove the temporary file
  fs.unlinkSync(tempFilePath);

  if (stderr) {
    console.error(`An error occurred: ${stderr}`);
    return;
  }

  return formatOutput(stdout);
};

export const checkDomain = async (domain: string) => {
  console.log("Checking domain " + domain);
  const result = await fetchSslInfo(domain);
  console.log(result);
  return result;
};

export const decodeSslCertificate = async (certificateContent: string) => {
  try {
    // Create a temporary file in the system's temp directory
    const tempFilePath = path.join(os.tmpdir(), `temp_crt_${Date.now()}.crt`);

    // Write the CSR to the temporary file
    fs.writeFileSync(tempFilePath, certificateContent);

    // OpenSSL command to decode the certificate
    const command = `openssl x509 -in ${tempFilePath} -text -noout`;
    console.log("command: " + command);
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    // Remove the temporary file
    fs.unlinkSync(tempFilePath);
    if (stderr) {
      console.error(`An error occurred: ${stderr}`);
      return;
    }

    console.log("Decoded SSL Certificate Information:\n");
    console.log(stdout);
    const formattedOutput = formatOutput(stdout);
    return formattedOutput;
  } catch (e) {
    console.error(`An exception occurred: ${e}`);
  }
};

export const certificateKeyMatcher = async (
  certificate: string,
  key: string,
  csr: string
) => {
  try {
    var checkCsr = false;
    var checkCert = false;
    // check if csr is empty
    if (csr === "") {
      console.log("CSR is empty");
    } else {
      checkCsr = true;
    }

    // check if cert is empty
    if (certificate === "") {
      console.log("Certificate is empty");
    } else {
      checkCert = true;
    }
    console.log("checkCsr: " + checkCsr);
    console.log("checkCert: " + checkCert);
    // Create temporary file for the key
    const tempKeyFilePath = path.join(
      os.tmpdir(),
      `temp_key_${Date.now()}.pem`
    );
    fs.writeFileSync(tempKeyFilePath, key);
    // Create temporary file for CSR, if needed
    let tempCsrFilePath = "";
    if (checkCsr) {
      tempCsrFilePath = path.join(os.tmpdir(), `temp_csr_${Date.now()}.pem`);
      fs.writeFileSync(tempCsrFilePath, csr);
    }

    // Create temporary file for the certificate if needed
    let tempCertFilePath = "";
    if (checkCert) {
      tempCertFilePath = path.join(os.tmpdir(), `temp_cert_${Date.now()}.pem`);
      fs.writeFileSync(tempCertFilePath, certificate);
    }

    // Extract the modulus and exponent from the certificate if needed
    let modulusCert = "";
    if (checkCert) {
      const { stdout: stdoutCert } = await execAsync(
        `openssl x509 -pubkey -noout -in ${tempCertFilePath} | openssl rsa -pubin -modulus -noout`
      );
      modulusCert = stdoutCert.replace("Modulus=", "").trim();
    }

    // Extract the modulus and exponent from the key
    const { stdout: stdoutKey } = await execAsync(
      `openssl rsa -modulus -noout -in ${tempKeyFilePath}`
    );
    const modulusKey = stdoutKey.replace("Modulus=", "").trim();

    // Extract the modulus from the CSR, if needed
    let modulusCsr = "";
    if (checkCsr) {
      const { stdout: stdoutCsr } = await execAsync(
        `openssl req -in ${tempCsrFilePath} -noout -modulus`
      );
      modulusCsr = stdoutCsr.replace("Modulus=", "").trim();
    }

    // Remove the temporary files
    fs.unlinkSync(tempKeyFilePath);

    // Remove the temporary CSR file, if needed
    if (checkCsr) {
      fs.unlinkSync(tempCsrFilePath);
    }
    if (checkCert) {
      fs.unlinkSync(tempCertFilePath);
    }

    // Perform matching logic
    // Check cert and key only
    if (checkCert && !checkCsr) {
      if (modulusCert === modulusKey) {
        return "Certificate and key matched!";
      } else {
        return "Certificate and key did NOT match!";
      }
    }

    // Check cert, key, and CSR
    if (checkCert && checkCsr) {
      if (modulusCert === modulusKey && modulusCert === modulusCsr) {
        return "Certificate, key, and CSR all matched!";
      } else if (modulusCert === modulusKey) {
        return "Certificate and key matched, but CSR did NOT match!";
      } else {
        return "Certificate and key did NOT match!";
      }
    }

    // Check CSR and key only
    if (!checkCert && checkCsr) {
      if (modulusKey === modulusCsr) {
        return "CSR and key matched!";
      } else {
        return "CSR and key did NOT match!";
      }
    }
  } catch (e) {
    console.error(`An exception occurred: ${e}`);
    return "Error";
  }
};

export const verifyCertificateChain = async (certificateChain: string) => {
  try {
    // Create a temporary file to store the certificate chain
    const tempChainFilePath = path.join(
      os.tmpdir(),
      `temp_chain_${Date.now()}.pem`
    );
    fs.writeFileSync(tempChainFilePath, certificateChain);

    // OpenSSL command to verify the certificate chain
    const command = `openssl verify -CAfile ${tempChainFilePath} ${tempChainFilePath}`;

    // Execute the command
    const { stdout, stderr } = await execAsync(command);

    // Remove the temporary file
    fs.unlinkSync(tempChainFilePath);

    if (stderr) {
      console.error(`An error occurred: ${stderr}`);
      return "Verification failed";
    }

    // If the output includes 'OK', the verification was successful
    if (stdout.includes("OK")) {
      console.log("Certificate chain verified successfully");
      return "Verification successful";
    } else {
      console.log("Certificate chain verification failed");
      return "Verification failed";
    }
  } catch (e) {
    console.error(`An exception occurred: ${e}`);
    return "Error";
  }
};

const { exec } = require('child_process');
const { promisify } = require('util');
import os from 'os';
import path from 'path';
import fs from 'fs';
const crypto = require('crypto');
const execAsync = promisify(exec);
const fetchSslInfo = async (domain: string) => {
  try {
    const command = `echo | openssl s_client -connect ${domain}:443 2>/dev/null | openssl x509 -noout -text -certopt no_header -certopt ca_default`;
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.error(`An error occurred: ${stderr}`);
      return;
    }

    // get ip
    const ipCommand = `dig +short ${domain}`;

    // prepend ip to stdout
    const ip = await execAsync(ipCommand);
    const output = `${domain} resolves to ${ip.stdout}${stdout}`;
    console.log('IP Address: ' + ip.stdout);

    console.log('SSL Certificate Information:\n');
    console.log(output);

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

  // Regex patterns
  const subjectPattern = /Subject: (.+)/;
  const sanPattern = /X509v3 Subject Alternative Name: \n +([^\n]+)/;

  // Extract information using regex
  const subject = stdout.match(subjectPattern)?.[1] || 'Not found';
  const san = stdout.match(sanPattern)?.[1] || 'No Subject Alternative Names found';

  // Log or return the extracted details
  console.log('Subject:', subject);
  console.log('Subject Alternative Names:', san);

  return `Subject: ${subject}\nSubject Alternative Names: ${san}`
};

export const checkDomain = async (domain: string) => {
    // Your domain checking logic here
    console.log("Checking domain " + domain)
    const result = await fetchSslInfo(domain);
    console.log(result)
    return result;
  };
  
export const decodeSslCertificate = async (certificateContent: string) => {
  try {
  // Create a temporary file in the system's temp directory
  const tempFilePath = path.join(os.tmpdir(), `temp_crt_${Date.now()}.crt`);
  
  // Write the CSR to the temporary file
  fs.writeFileSync(tempFilePath, certificateContent);
  
    // OpenSSL command to decode the certificate
    const command = `openssl x509 -in ${tempFilePath} -text -noout -certopt ca_default`;
    console.log("command: " + command)
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
  // Remove the temporary file
  fs.unlinkSync(tempFilePath);
    if (stderr) {
      console.error(`An error occurred: ${stderr}`);
      return;
    }

    console.log('Decoded SSL Certificate Information:\n');
    console.log(stdout);

    return stdout;
  } catch (e) {
    console.error(`An exception occurred: ${e}`);
  }
};


export const certificateKeyMatcher = async (certificate: string, key: string) => {
  try {
    // Create temporary files for the certificate and key
    const tempCertFilePath = path.join(os.tmpdir(), `temp_cert_${Date.now()}.pem`);
    const tempKeyFilePath = path.join(os.tmpdir(), `temp_key_${Date.now()}.pem`);

    // Write the certificate and key to the temporary files
    fs.writeFileSync(tempCertFilePath, certificate);
    fs.writeFileSync(tempKeyFilePath, key);

    // Extract the modulus and exponent from the certificate
    const { stdout: stdoutCert } = await execAsync(`openssl x509 -pubkey -noout -in ${tempCertFilePath} | openssl rsa -pubin -modulus -noout`);
    const modulusCert = stdoutCert.replace('Modulus=', '').trim();
    console.log("modulusCert: " + modulusCert)

    // Extract the modulus and exponent from the key
    const { stdout: stdoutKey } = await execAsync(`openssl rsa -modulus -noout -in ${tempKeyFilePath}`);
    const modulusKey = stdoutKey.replace('Modulus=', '').trim();
    console.log("modulusKey: " + modulusKey)

    // Remove the temporary files
    fs.unlinkSync(tempCertFilePath);
    fs.unlinkSync(tempKeyFilePath);

    // Compare the moduli
    if (modulusCert === modulusKey) {
      return 'Certificate key matched!';
    } else {
      return 'Certificate key did NOT match!';
    }
  } catch (e) {
    console.error(`An exception occurred: ${e}`);
    return 'Error';
  }
};
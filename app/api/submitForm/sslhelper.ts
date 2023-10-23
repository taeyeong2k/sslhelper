const { exec } = require('child_process');
const { promisify } = require('util');
import fs from 'fs';
import os from 'os';
import path from 'path';

const execAsync = promisify(exec);

const fetchSslInfo = async (domain: string) => {
  try {
    const command = `echo | openssl s_client -connect ${domain}:443 2>/dev/null | openssl x509 -noout  -subject -issuer -email -dates -ext "subjectAltName"`;
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
  const publicKeyPattern = /Public Key Algorithm: (.+)/;
  const sanPattern = /X509v3 Subject Alternative Name: \n +([^\n]+)/;

  // Extract information using regex
  const subject = stdout.match(subjectPattern)?.[1] || 'Not found';
  const publicKeyAlgo = stdout.match(publicKeyPattern)?.[1] || 'Not found';
  const san = stdout.match(sanPattern)?.[1] || 'No Subject Alternative Names found';

  // Log or return the extracted details
  console.log('Subject:', subject);
  console.log('Public Key Algorithm:', publicKeyAlgo);
  console.log('Subject Alternative Names:', san);

  return {
    subject,
    publicKeyAlgo,
    san
  };
};



export const checkDomain = async (domain: string) => {
    // Your domain checking logic here
    console.log("Checking domain " + domain)
    const result = await fetchSslInfo(domain);
    console.log(result)
    return result;
  };
  
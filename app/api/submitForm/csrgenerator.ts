const { exec } = require("child_process");
const { promisify } = require("util");
import { CsrData } from "@/app/utils/types";
import os from "os";
import path from "path";
import fs from "fs";
const execAsync = promisify(exec);

const csr_template = `[ req ]
distinguished_name  = req_distinguished_name
req_extensions      = req_ext

[ req_distinguished_name ]
countryName                     = Country Name (2 letter code)
									# US
countryName_default             = {Country}
stateOrProvinceName             = State or Province Name (full name)
									# Indiana
stateOrProvinceName_default     = {State}
localityName                    = Locality Name (eg, city)
									# Indianapolis
localityName_default            = {Location}
organizationName                = Organization Name (eg, company)
									# Foo Group, Inc.
organizationName_default        = {Organization}
organizationalUnitName          = Organization Unit (eg, department)
									# Information Technology
organizationalUnitName_default  = {Org_Unit}
emailAddress                    = Email Address (eg, webmaster@example.com)
									# foo.guy@bar.com
emailAddress_default            = {Email}
commonName                      = 	Common Name (eg, YOUR name)
commonName_max                  = 64
									# *.foo.com
commonName_default              = {CN}

[ req_ext ]
subjectAltName          = @alt_names

[alt_names ]
[alt_names ]
{alt_names_list}
`;

export async function generateCsr(input: CsrData) {
  console.log("input", input);
  const {
    commonName,
    organization,
    organizationalUnit,
    country,
    state,
    location,
    email,
  } = input;
  const splitCnames = commonName.split(/[\n ,]+/).map((name) => name.trim());
  const mainCN = splitCnames[0];
  const sanEntries = splitCnames
  .filter(name => name.trim() !== '') // Filter out empty or whitespace-only entries
  .map((name, index) => `DNS.${index + 1} = ${name}`)
  .join("\n");

  console.log("sanEntries", sanEntries);
  const configFileContent = csr_template
    .replace("{Country}", country)
    .replace("{State}", state)
    .replace("{Location}", location)
    .replace("{Organization}", organization)
    .replace("{Org_Unit}", organizationalUnit)
    .replace("{Email}", email)
    .replace("{CN}", mainCN)
    .replace("{alt_names_list}", sanEntries);

  console.log("configFileContent", configFileContent);
  const configFilePath = path.join(
    os.tmpdir(),
    `temp_config_${Date.now()}.cnf`
  );
  fs.writeFileSync(configFilePath, configFileContent);

  // Path for the private key and CSR
  const privateKeyPath = path.join(os.tmpdir(), `temp_key_${Date.now()}.key`);
  const csrPath = path.join(os.tmpdir(), `temp_csr_${Date.now()}.csr`);

  const genCsrCommand = `openssl req -new -sha256 -batch -nodes -newkey rsa:2048 -keyout ${privateKeyPath} -out ${csrPath} -config ${configFilePath}`;
  try {
    console.log("Generating CSR...");
    const { stdout, stderr } = await execAsync(genCsrCommand);
  
    // Check if CSR was generated successfully
    if (!fs.existsSync(csrPath)) {
      console.error("CSR file was not created.");
      if (stderr) {
        console.error(`Error generating CSR: ${stderr}`);
      }
      return;
    }
  
    const csr = fs.readFileSync(csrPath, "utf8");
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    console.log("CSR generated successfully:\n", csr);
    const output = `CSR:\n${csr}\n\nPrivate Key:\n${privateKey}\n\nConfig:\n${configFileContent}`;
    // Cleanup
    fs.unlinkSync(configFilePath);
    fs.unlinkSync(privateKeyPath);
    fs.unlinkSync(csrPath);
  
    return output;
  } catch (e) {
    console.error(`An exception occurred: ${e}`);
  }
}
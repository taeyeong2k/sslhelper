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
`

export async function generateCsr(input: CsrData) {
  // console.log("input", input);
  const cnames = input.commonName;
  const { commonName, organization, organizationalUnit, country, state, location, email } = input;
  const splitCnames = commonName.split(/[\n ,]+/).map(name => name.trim());
  const mainCN = splitCnames[0];
  const sanEntries = splitCnames.map((name, index) => `DNS.${index + 1} = ${name}`).join("\n");
  // console.log("sanEntries", sanEntries);
  const configFileContent = csr_template
    .replace("{Country}", country)
    .replace("{State}", state)
    .replace("{Location}", location)
    .replace("{Organization}", organization)
    .replace("{Org_Unit}", organizationalUnit)
    .replace("{Email}", email)
    .replace("{CN}", mainCN)
    .replace("{alt_names_list}", sanEntries);

    const configFilePath = path.join(os.tmpdir(), `temp_config_${Date.now()}.cnf`);
    fs.writeFileSync(configFilePath, configFileContent);

    const privateKeyPath = path.join(os.tmpdir(), `temp_key_${Date.now()}.key`);
    const csrPath = path.join(os.tmpdir(), `temp_csr_${Date.now()}.csr`);
    const command = `openssl req -new -keyout ${privateKeyPath} -out ${csrPath} -config ${configFilePath}`;
      try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error(`Error generating CSR: ${stderr}`);
      return;
    }

    const csr = fs.readFileSync(csrPath, 'utf8');
    console.log("CSR generated successfully:\n", csr);

    // Step 4: Cleanup
    fs.unlinkSync(configFilePath);
    fs.unlinkSync(privateKeyPath);
    fs.unlinkSync(csrPath);

    return csr;
  } catch (e) {
    console.error(`An exception occurred: ${e}`);
  }
}

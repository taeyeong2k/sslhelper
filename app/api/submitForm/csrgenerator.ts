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

export function generateCsr(input: CsrData) {
  console.log("input", input);
  const cnames = input.commonName;
  const { commonName, organization, organizationalUnit, country, state, location, email } = input;
  const splitCnames = commonName.split(/[\n ,]+/).map(name => name.trim());
  const mainCN = splitCnames[0];
  const sanEntries = splitCnames.map((name, index) => `DNS.${index + 1} = ${name}`).join("\n");
  console.log("sanEntries", sanEntries);
  return "Test";
}

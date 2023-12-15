// Define patterns to extract relevant information
const countryPattern = /Subject:.*?C\s*=\s*([^\n\r,]+)/;
const statePattern = /Subject:.*?ST\s*=\s*([^\n\r,]+)/;
const locationPattern = /Subject:.*?L\s*=\s*([^\n\r,]+)/;
const organizationPattern = /Subject:.*?O\s*=\s*(?:")?([^\n\r",]+)(?:"|,|$)/;
const organizationUnitPattern =
  /Subject:.*?OU\s*=\s*(?:")?([^\n\r",]+)(?:"|,|$)/;
const commonNamePattern = /Subject:.*?CN\s*=\s*([^\n\r,]+)/;
const altNamesPattern =
  /X509v3 Subject Alternative Name:\s*((?:DNS:[^\n\r,]+,?\s*)+)/;
const validFromPattern = /Not Before:\s*([^\n\r]+)/;
const validToPattern = /Not After :\s*([^\n\r]+)/;
const issuerCNPattern = /Issuer:.*?CN\s*=\s*([^,\n]+)/;
const emailAddressPattern = /Subject:.*?emailAddress\s*=\s*([^\n\r,]+)/;

const findValue = (pattern: RegExp, output: string): string => {
  const match = output.match(pattern);
  return match ? match[1].trim() : "";
};

export function formatOutput(output: string): string {
  // Helper function to find a value using a regex pattern

  // Extract information using defined patterns
  const country = findValue(countryPattern, output);
  const state = findValue(statePattern, output);
  const location = findValue(locationPattern, output);
  const organization = findValue(organizationPattern, output);
  const organizationUnit = findValue(organizationUnitPattern, output); // Modify this accordingly
  const commonName = findValue(commonNamePattern, output);
  let altNames = findValue(altNamesPattern, output);
  altNames = altNames
    .replace(/DNS:/g, "")
    .replace(/\s*,\s*/g, ", ")
    .trim();
  const validFrom = findValue(validFromPattern, output);
  const validTo = findValue(validToPattern, output);
  const issuerCN = findValue(issuerCNPattern, output);
  const emailAddress = findValue(emailAddressPattern, output);

  // Format the extracted information
  const formattedOutput = `
=============================================
             CERT decoded text
=============================================
Country             : ${country}
State               : ${state}
Location            : ${location}
Organization        : ${organization}
Organization Unit   : ${organizationUnit}
Common Name         : ${commonName}
Alt Names           : ${altNames}
Valid From          : ${validFrom}
Valid To            : ${validTo}
Email Address       : ${emailAddress}
Issuer              : ${issuerCN}
=============================================
`;
  return formattedOutput;
}


// Functions to format commands for Vercel
export function formatCheckDomainCommand(domain: string): string {
    return `OpenSSL is not available on Vercel. Run the following command instead: \necho | openssl s_client -connect ${domain}:443 -servername ${domain} 2>/dev/null | openssl x509 -noout -text`;
}


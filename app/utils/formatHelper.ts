export function formatDomainOutput(output: string): string {
    // Helper function to find a value using a regex pattern
    const findValue = (pattern: RegExp) => {
        const match = output.match(pattern);
        return match ? match[1].trim() : '';
    };

    // Define patterns to extract relevant information
    const countryPattern = /Subject:.*?C\s*=\s*([^\n\r,]+)/;
    const statePattern = /Subject:.*?ST\s*=\s*([^\n\r,]+)/;
    const locationPattern = /Subject:.*?L\s*=\s*([^\n\r,]+)/;
    const organizationPattern = /Subject:.*?O\s*=\s*(?:")?([^\n\r",]+)(?:"|,|$)/;
    const organizationUnitPattern = /Subject:.*?OU\s*=\s*"([^"]+)"/; // Add this if Organization Unit appears in some outputs
    const commonNamePattern = /Subject:.*?CN\s*=\s*([^\n\r,]+)/;
    const altNamesPattern = /X509v3 Subject Alternative Name:\s*((?:DNS:[^\n\r,]+,?\s*)+)/;
    const validFromPattern = /Not Before:\s*([^\n\r]+)/;
    const validToPattern = /Not After :\s*([^\n\r]+)/;
    const issuerCNPattern = /Issuer:.*?CN\s*=\s*([^,\n]+)/;

    // Extract information using defined patterns
    const country = findValue(countryPattern);
    const state = findValue(statePattern);
    const location = findValue(locationPattern);
    const organization = findValue(organizationPattern);
    const organizationUnit = findValue(organizationUnitPattern); // Modify this accordingly
    const commonName = findValue(commonNamePattern);
    let altNames = findValue(altNamesPattern);
    altNames = altNames.replace(/DNS:/g, '').replace(/\s*,\s*/g, ', ').trim();
    const validFrom = findValue(validFromPattern);
    const validTo = findValue(validToPattern);
    const issuerCN = findValue(issuerCNPattern);

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
Email Address       :
Valid From          : ${validFrom}
Valid To            : ${validTo}
Issuer              : ${issuerCN}
=============================================
`
    return formattedOutput;
}
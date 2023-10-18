const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const fetchSslInfo = async (domain: string) => {
  try {
    const command = `echo | openssl s_client -connect ${domain}:443 2>/dev/null | openssl x509 -noout -subject -issuer`;
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.error(`An error occurred: ${stderr}`);
      return;
    }

    console.log('SSL Certificate Information:\n');
    console.log(stdout);

    return stdout;
  } catch (e) {
    console.error(`An exception occurred: ${e}`);
  }
};



export const checkDomain = async (domain: string) => {
    // Your domain checking logic here
    console.log("Checking domain " + domain)
    const result = await fetchSslInfo(domain);
    console.log(result)
    return result;
  };
  
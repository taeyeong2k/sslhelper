# SSLHelper

### Overview

https://sslhelper.com

SSLHelper is a tool designed to assist with various functions related to managing, generating, validating and handling SSL certificates. You can self-host the project to access these functions without having to send sensitive data over the internet. It uses `openssl` commands on the backend to perform the various functions and returns the parsed output to the frontend.

### Functionality
- Check Domain

Enter a domain name to fetch information of the SSL certificate for that website.

- CSR Decoder

Enter the contents of a CSR to retrieve the information used to generate it (Country, State, Location, Organization, Organization Unit, Common Name, Alt Names, Email Address).

- CSR Generator

Provide information to generate a CSR file based on the provided information.

- SSL Certificate Decoder

Retrieve the information associated with a raw SSL certificate.

- Certificate Key Matcher

Verify any combination of a raw SSL Certificate, private key, and CSR.

- Verify Certificate Chain

Verify that all certificates in a chain match one another.


### Installation and Usage
This is a Next.js project. You can use `npm`, `yarn`, or any other JavaScript package manager to build and run the project locally, or use Docker. 

#### Without Docker

1. Clone the repository
```sh
git clone https://github.com/taeyeong2k/sslhelper.git
cd sslhelper
```

2. Install dependencies
```sh
npm install
```

3. Run the program
```sh
npm run dev
```

You can then access the site on https://localhost:3000.

#### With Docker - From Source
1. Clone the repository
```sh
git clone https://github.com/taeyeong2k/sslhelper.git
cd sslhelper
```

2. Build a Docker image using the included Dockerfile
```sh
docker build -t sslhelper .
```

3. Run a Docker container using the image
```sh
docker run --rm sslhelper
```

#### With Docker - Using Pre-Built Image
1. Pull the image
```sh
# From Docker Hub
docker pull taeyeongk/sslhelper:latest

# OR

# From Github Container Registry
docker pull ghcr.io/taeyeong2k/sslhelper:latest
```

2. Run the container
```sh
# Depending on where you pulled the image from
# Docker Hub
docker run --rm taeyeongk/sslhelper

# OR
# Github Container Registry
docker run --rm ghcr.io/taeyeong2k/sslhelper
```
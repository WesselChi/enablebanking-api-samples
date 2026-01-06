'use strict';

const fetch = require('node-fetch');
const { getJWT, config } = require("./utils");

const testConnection = async function() {
  console.log("Testing Enable Banking API connection...\n");

  // Step 1: Check config file
  console.log("1. Config check:");
  console.log(`   Application ID: ${config.applicationId}`);
  console.log(`   Key Path: ${config.keyPath}`);
  console.log(`   Redirect URL: ${config.redirectUrl}\n`);

  // Step 2: Try to generate JWT
  console.log("2. Generating JWT token...");
  let JWT;
  try {
    JWT = getJWT();
    console.log("   ✓ JWT generated successfully\n");
  } catch (error) {
    console.log("   ✗ Failed to generate JWT");
    console.log(`   Error: ${error.message}`);
    console.log("\n   This usually means:");
    console.log("   - The keyPath in config.json is incorrect");
    console.log("   - The .pem file doesn't exist or is invalid\n");
    return;
  }

  // Step 3: Test API connection
  console.log("3. Testing API connection...");
  const BASE_URL = "https://api.enablebanking.com";
  const baseHeaders = {
    Authorization: `Bearer ${JWT}`,
    "Content-Type": "application/json"
  };

  try {
    const applicationResponse = await fetch(`${BASE_URL}/application`, {
      headers: baseHeaders
    });

    if (applicationResponse.ok) {
      const data = await applicationResponse.json();
      console.log("   ✓ Successfully connected to Enable Banking API!\n");
      console.log("   Application details:");
      console.log(`   - Name: ${data.name || 'N/A'}`);
      console.log(`   - ID: ${data.id}`);
      console.log(`   - Status: ${data.status || 'active'}\n`);

      console.log("✓ All tests passed! Your configuration is correct.\n");
    } else {
      const errorText = await applicationResponse.text();
      console.log(`   ✗ API request failed (Status: ${applicationResponse.status})`);
      console.log(`   Response: ${errorText}\n`);
      console.log("   This usually means:");
      console.log("   - The applicationId in config.json is incorrect");
      console.log("   - The private key doesn't match the application");
      console.log("   - Your application might not be properly registered\n");
    }
  } catch (error) {
    console.log("   ✗ Connection error");
    console.log(`   Error: ${error.message}\n`);
    console.log("   This usually means:");
    console.log("   - No internet connection");
    console.log("   - Network/firewall issues\n");
  }
};

(async () => {
  try {
    await testConnection();
  } catch (error) {
    console.log(`\n✗ Unexpected error: ${error.message}`);
  }
})();

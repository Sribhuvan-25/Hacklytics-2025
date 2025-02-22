const crypto = require("crypto");
require("dotenv").config();
const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

/**
 * Generate Secret Hash required for authentication
 */
const generateSecretHash = (email) => {
  return crypto
    .createHmac("sha256", process.env.CLIENT_SECRET) // Use CLIENT_SECRET as the key
    .update(email + process.env.CLIENT_ID) // Concatenate EMAIL + CLIENT_ID
    .digest("base64"); // Encode result in base64
};

/**
 * User Signup with Cognito
 */
const signUp = async (email, password) => {
  // Remove formattedName parameter
  try {
    const secretHash = generateSecretHash(email);

    const command = new SignUpCommand({
      ClientId: process.env.CLIENT_ID,
      Username: email, // Use email as the username
      Password: password,
      SecretHash: secretHash, // Include SecretHash
      UserAttributes: [
        { Name: "email", Value: email },
        // Remove name.formatted attribute
      ],
    });

    return await client.send(command);
  } catch (error) {
    console.error("Signup Error:", error.message); // Log error message
    throw new Error(error.message);
  }
};

/**
 * User Login with Cognito
 */
const login = async (email, password) => {
  try {
    const secretHash = generateSecretHash(email);

    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        USERNAME: email, // Use email as the username
        PASSWORD: password,
        SECRET_HASH: secretHash, // Include SecretHash
      },
    });

    return await client.send(command);
  } catch (error) {
    console.error("Login Error:", error.message); // Log error message
    throw new Error(error.message);
  }
};

module.exports = { signUp, login };

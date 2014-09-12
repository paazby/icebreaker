var httpClient = require('./http-client');

var generateToken = function (){
  console.log(httpClient.makeAuthenticationString());
};

generateToken();

// apiKey
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcGlLZXkiOiJ6b3VuZHNfcGVla2luZyJ9.U-2sjzUTITlXuetMgYJJFEQ6LJQ-5mx1dLwUa6xQfFI
// token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmYl9pZCI6MX0.6b25pFP_3EynNYzzCKWhNMTGUqicCrKKg7sQxFKcdT4
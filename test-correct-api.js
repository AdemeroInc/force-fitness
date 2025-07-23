const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fetch = require('node-fetch');
const fs = require('fs');

async function getSecret(secretName) {
  const secretClient = new SecretManagerServiceClient();
  const projectId = 'force-fitness-1753281211';
  
  const [version] = await secretClient.accessSecretVersion({
    name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
  });
  
  return version.payload?.data?.toString();
}

async function getAccessToken() {
  const serviceKey = await getSecret('vertex-ai-service-key');
  const credentials = JSON.parse(serviceKey);
  
  const jwt = require('jsonwebtoken');
  
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };
  
  const token = jwt.sign(payload, credentials.private_key, { algorithm: 'RS256' });
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`
  });
  
  const data = await response.json();
  return data.access_token;
}

async function testCorrectImagenAPI() {
  try {
    console.log('🔧 Using CORRECT Imagen prediction API (not generative content API)');
    
    const accessToken = await getAccessToken();
    const projectId = 'force-fitness-1753281211';
    const location = 'us-central1';
    
    // Use the PREDICTION API endpoint, not generateContent
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-fast-generate-001:predict`;
    
    console.log('🌐 Endpoint:', url);
    
    const requestBody = {
      instances: [{
        prompt: 'A simple blue fitness dumbbell on white background'
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '1:1',
        includeRaiReason: false
        // Remove seed parameter as it conflicts with watermark
      }
    };
    
    console.log('📝 Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📊 Response status:', response.status);
    const result = await response.json();
    
    if (!response.ok) {
      console.log('❌ API Error:', result);
      
      if (result.error && result.error.message.includes('online_prediction_requests_per_base_model')) {
        console.log('🎯 NOW we\'re hitting the correct quota!');
        console.log('📈 Your quota is set to 200, so this should work...');
      }
      
      return;
    }
    
    console.log('✅ SUCCESS! Imagen 3 responded!');
    console.log('📋 Response:', JSON.stringify(result, null, 2));
    
    // Extract and save image
    if (result.predictions && result.predictions[0]) {
      const prediction = result.predictions[0];
      if (prediction.bytesBase64Encoded) {
        const imageData = Buffer.from(prediction.bytesBase64Encoded, 'base64');
        fs.writeFileSync('test2.png', imageData);
        console.log('💾 Real AI-generated image saved as test2.png!');
        console.log(`📊 Size: ${imageData.length} bytes`);
        console.log('🎉 IMAGEN 3 WORKING WITH CORRECT API!');
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testCorrectImagenAPI();
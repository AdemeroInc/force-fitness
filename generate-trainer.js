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

async function generateFitnessTrainer() {
  try {
    console.log('🏋️ Generating photorealistic fitness trainer with Imagen 3...');
    
    const accessToken = await getAccessToken();
    const projectId = 'force-fitness-1753281211';
    const location = 'us-central1';
    
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-fast-generate-001:predict`;
    
    const requestBody = {
      instances: [{
        prompt: `Professional fitness trainer in a modern gym, photorealistic portrait, confident and encouraging expression, athletic build, wearing modern workout attire, high-quality studio lighting, detailed facial features, professional photography style, 8K resolution, hyperrealistic details`
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '3:4',
        includeRaiReason: false,
        // Allow person generation for this trainer image
        personGeneration: 'allow_adult'
      }
    };
    
    console.log('📝 Generating with prompt:', requestBody.instances[0].prompt);
    
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
      return;
    }
    
    console.log('✅ SUCCESS! Photorealistic trainer generated!');
    
    // Extract and save image
    if (result.predictions && result.predictions[0]) {
      const prediction = result.predictions[0];
      if (prediction.bytesBase64Encoded) {
        const imageData = Buffer.from(prediction.bytesBase64Encoded, 'base64');
        fs.writeFileSync('test3.png', imageData);
        console.log('💾 Photorealistic fitness trainer saved as test3.png!');
        console.log(`📊 Size: ${imageData.length} bytes`);
        console.log('🎯 Aspect ratio: 3:4 (portrait orientation)');
        console.log('🏃‍♂️ Ready to use in your fitness app!');
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

generateFitnessTrainer();
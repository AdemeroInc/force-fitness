const { VertexAI } = require('@google-cloud/vertexai');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');

async function getSecret(secretName) {
  const secretClient = new SecretManagerServiceClient();
  const projectId = 'force-fitness-1753281211';
  
  const [version] = await secretClient.accessSecretVersion({
    name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
  });
  
  const payload = version.payload?.data?.toString();
  if (!payload) {
    throw new Error(`Failed to retrieve secret: ${secretName}`);
  }
  
  return payload;
}

async function generateTestImage() {
  try {
    console.log('Initializing Vertex AI...');
    
    // Get credentials from Secret Manager
    const serviceKey = await getSecret('vertex-ai-service-key');
    const credentials = JSON.parse(serviceKey);
    
    const vertexAI = new VertexAI({
      project: 'force-fitness-1753281211',
      location: 'us-central1',
      credentials,
    });
    
    console.log('Getting Imagen 3 model...');
    const model = vertexAI.getGenerativeModel({
      model: 'imagen-3.0-fast-generate-001',
    });
    
    console.log('Generating image...');
    const prompt = 'A modern fitness app logo with dumbbells and a lightning bolt, clean minimalist design, blue and white colors';
    
    const request = {
      prompt,
      aspectRatio: '1:1',
      negativePrompt: 'blurry, low quality, text, watermark',
      personGeneration: 'dont_allow',
    };
    
    const result = await model.generateContent(request);
    console.log('Image generated successfully!');
    
    // Extract the image data
    const response = result.response;
    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        const part = candidate.content.parts[0];
        if (part.inlineData && part.inlineData.data) {
          // Decode base64 image data
          const imageData = Buffer.from(part.inlineData.data, 'base64');
          
          // Save to file
          fs.writeFileSync('test.png', imageData);
          console.log('Image saved as test.png');
          return;
        }
      }
    }
    
    throw new Error('No image data found in response');
    
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

generateTestImage();
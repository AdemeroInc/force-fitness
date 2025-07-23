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

async function initializeVertexAI() {
  const project = 'force-fitness-1753281211';
  const location = 'us-central1';
  
  const serviceKey = await getSecret('vertex-ai-service-key');
  const credentials = JSON.parse(serviceKey);
  
  return new VertexAI({
    project,
    location,
    credentials,
  });
}

async function testImagen() {
  console.log('🔍 Testing different Imagen models and configurations...');
  
  const modelVersions = [
    'imagen-3.0-generate-001',
    'imagegeneration@006',
    'imagegeneration@005',
    'imagegeneration@002'
  ];
  
  const vertex = await initializeVertexAI();
  
  for (const modelName of modelVersions) {
    try {
      console.log(`\n📝 Trying model: ${modelName}`);
      
      const model = vertex.getGenerativeModel({
        model: modelName,
      });
      
      // Very simple prompt
      const prompt = 'A blue fitness dumbbell icon on white background';
      
      console.log(`   Prompt: "${prompt}"`);
      
      const request = {
        prompt: prompt,
      };
      
      // Add model-specific parameters
      if (modelName.includes('imagen-3.0')) {
        request.aspectRatio = '1:1';
        request.personGeneration = 'dont_allow';
      }
      
      console.log('   Making API call...');
      const result = await model.generateContent(request);
      
      console.log('✅ SUCCESS! Image generated with model:', modelName);
      
      // Extract and save the image
      const response = result.response;
      if (response.candidates && response.candidates[0]) {
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          const part = candidate.content.parts[0];
          if (part.inlineData && part.inlineData.data) {
            const imageData = Buffer.from(part.inlineData.data, 'base64');
            fs.writeFileSync('test2.png', imageData);
            console.log('💾 Image saved as test2.png');
            console.log(`🎯 Used model: ${modelName}`);
            return;
          }
        }
      }
      
      console.log('⚠️ No image data in response from', modelName);
      
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.message);
      
      // If it's not a quota error, log more details
      if (!error.message.includes('429') && !error.message.includes('quota')) {
        console.log('   Full error:', error);
      }
      
      continue; // Try next model
    }
  }
  
  console.log('\n❌ All models failed. This might indicate a billing or permissions issue.');
  console.log('💡 Let\'s check if the service account has the right permissions...');
  
  // Test with a simpler AI Platform call
  try {
    console.log('\n🔍 Testing basic Vertex AI connectivity...');
    const model = vertex.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
    
    const result = await model.generateContent('Say hello');
    console.log('✅ Vertex AI connectivity works - Gemini response:', result.response.text());
    console.log('🤔 Issue seems specific to image generation models');
    
  } catch (error) {
    console.log('❌ Basic Vertex AI connectivity failed:', error.message);
    console.log('💡 This suggests a broader service account or billing issue');
  }
}

testImagen().catch(console.error);
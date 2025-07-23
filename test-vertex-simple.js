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

async function testWithDifferentRegions() {
  const project = 'force-fitness-1753281211';
  const serviceKey = await getSecret('vertex-ai-service-key');
  const credentials = JSON.parse(serviceKey);
  
  const regions = ['us-central1', 'us-west1', 'us-east1'];
  
  for (const location of regions) {
    try {
      console.log(`\n🌍 Testing region: ${location}`);
      
      const vertex = new VertexAI({
        project,
        location,
        credentials,
      });
      
      // Try Gemini first (text model)
      console.log('   Testing Gemini text generation...');
      const textModel = vertex.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
      
      const textResult = await textModel.generateContent('Hello');
      console.log(`   ✅ Gemini works in ${location}:`, textResult.response.text().substring(0, 50) + '...');
      
      // Now try image generation
      console.log('   Testing image generation...');
      const imageModel = vertex.getGenerativeModel({
        model: 'imagen-3.0-fast-generate-001',
      });
      
      const imageResult = await imageModel.generateContent({
        prompt: 'A simple blue circle',
        aspectRatio: '1:1',
        personGeneration: 'dont_allow'
      });
      
      console.log(`   ✅ Image generation works in ${location}!`);
      
      // Save the image
      const response = imageResult.response;
      if (response.candidates && response.candidates[0]) {
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          const part = candidate.content.parts[0];
          if (part.inlineData && part.inlineData.data) {
            const imageData = Buffer.from(part.inlineData.data, 'base64');
            fs.writeFileSync('test2.png', imageData);
            console.log(`   💾 Image saved as test2.png using region ${location}`);
            return;
          }
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Region ${location} failed:`, error.message.substring(0, 100) + '...');
      continue;
    }
  }
  
  console.log('\n❌ All regions failed. The issue might be:');
  console.log('1. Vertex AI Generative AI APIs need to be explicitly enabled');
  console.log('2. Terms of service need to be accepted in the console');
  console.log('3. The project needs to be allowlisted for these APIs');
  
  console.log('\n💡 Let\'s check what services are actually enabled...');
  
  // As a final test, let's see if we can at least list available models
  try {
    const vertex = new VertexAI({
      project,
      location: 'us-central1',
      credentials,
    });
    
    // This should work if the basic setup is correct
    console.log('🔍 Basic Vertex AI initialization successful');
    
  } catch (error) {
    console.log('❌ Even basic Vertex AI initialization failed:', error.message);
  }
}

testWithDifferentRegions().catch(console.error);
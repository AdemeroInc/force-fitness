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

async function testWithUpdatedPermissions() {
  try {
    console.log('🔄 Testing with updated permissions...');
    
    const project = 'force-fitness-1753281211';
    const location = 'us-central1';
    
    // Get fresh credentials
    const serviceKey = await getSecret('vertex-ai-service-key');
    const credentials = JSON.parse(serviceKey);
    
    console.log('🔑 Using service account:', credentials.client_email);
    
    const vertex = new VertexAI({
      project,
      location,
      credentials,
    });
    
    console.log('🎨 Attempting Imagen 3 with updated permissions...');
    
    const model = vertex.getGenerativeModel({
      model: 'imagen-3.0-fast-generate-001',
    });
    
    const result = await model.generateContent({
      prompt: 'A simple blue fitness dumbbell on white background',
      aspectRatio: '1:1',
      personGeneration: 'dont_allow'
    });
    
    console.log('✅ SUCCESS! Image generated with Imagen 3!');
    
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
          console.log(`📊 File size: ${imageData.length} bytes`);
          console.log('🎉 REAL IMAGEN 3 GENERATION WORKING!');
          return;
        }
      }
    }
    
    console.log('⚠️ Unexpected response format');
    console.log('Full response:', JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.log('❌ Still getting error:', error.message);
    
    if (error.message.includes('429')) {
      console.log('\n🤔 Still hitting quota limits. Possible reasons:');
      console.log('1. Default quotas for new projects might be 0');
      console.log('2. Permissions update hasn\'t propagated yet');
      console.log('3. Need to explicitly request quota increases');
      
      console.log('\n💡 Let\'s try the Google AI Studio API instead...');
      
      // Try alternative approach
      await tryAlternativeAPI();
    } else {
      console.log('New error type:', error);
    }
  }
}

async function tryAlternativeAPI() {
  try {
    console.log('\n🔄 Trying direct Google AI API...');
    
    // This would require a different API key from Google AI Studio
    // For now, let's at least verify our service account can access other Vertex services
    
    const project = 'force-fitness-1753281211';
    const serviceKey = await getSecret('vertex-ai-service-key');
    const credentials = JSON.parse(serviceKey);
    
    const vertex = new VertexAI({
      project,
      location: 'us-central1',
      credentials,
    });
    
    // Try a text model first to see if permissions work
    console.log('📝 Testing text generation with Gemini...');
    
    const textModel = vertex.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
    
    const textResult = await textModel.generateContent('Say "permissions working" in 2 words');
    console.log('✅ Text generation works:', textResult.response.text());
    console.log('🎯 This confirms Vertex AI access is working!');
    
  } catch (error) {
    console.log('❌ Alternative approach failed:', error.message.substring(0, 100));
  }
}

testWithUpdatedPermissions();
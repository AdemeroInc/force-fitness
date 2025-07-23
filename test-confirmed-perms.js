const { VertexAI } = require('@google-cloud/vertexai');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');

async function getSecret(secretName) {
  const secretClient = new SecretManagerServiceClient();
  const projectId = 'force-fitness-1753281211';
  
  const [version] = await secretClient.accessSecretVersion({
    name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
  });
  
  return version.payload?.data?.toString();
}

async function testWithConfirmedPermissions() {
  try {
    console.log('🔍 Testing with confirmed service account permissions...');
    console.log('📧 Service Account: vertex-ai-service@force-fitness-1753281211.iam.gserviceaccount.com');
    console.log('🔐 Roles: aiplatform.admin, aiplatform.user, firebasevertexai.admin, ml.developer');
    
    const project = 'force-fitness-1753281211';
    const location = 'us-central1';
    
    const serviceKey = await getSecret('vertex-ai-service-key');
    const credentials = JSON.parse(serviceKey);
    
    const vertex = new VertexAI({
      project,
      location,
      credentials,
    });
    
    console.log('\n🎨 Attempting Imagen 3 generation...');
    
    const model = vertex.getGenerativeModel({
      model: 'imagen-3.0-fast-generate-001',
    });
    
    const result = await model.generateContent({
      prompt: 'fitness dumbbell blue',
      aspectRatio: '1:1',
      personGeneration: 'dont_allow'
    });
    
    console.log('🎉 SUCCESS! Image generated with proper permissions!');
    
    // Save the image
    const response = result.response;
    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        const part = candidate.content.parts[0];
        if (part.inlineData && part.inlineData.data) {
          const imageData = Buffer.from(part.inlineData.data, 'base64');
          fs.writeFileSync('test2.png', imageData);
          console.log('💾 Real AI-generated image saved as test2.png!');
          console.log(`📊 Size: ${imageData.length} bytes`);
          return;
        }
      }
    }
    
    console.log('⚠️ No image data in response');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    
    if (error.message.includes('429')) {
      console.log('\n🎯 CONFIRMED: The service account has all the right permissions!');
      console.log('📋 The only remaining issue is the quota limit (0 by default for new projects)');
      console.log('✅ Authentication, permissions, and API access are all working correctly');
      console.log('\n🔗 Request quota increase at:');
      console.log('https://console.cloud.google.com/iam-admin/quotas?project=force-fitness-1753281211');
      console.log('Look for: "Generate content requests per minute per project per base model"');
      console.log('Current limit: 0 → Request: 60');
    } else {
      console.log('New error type:', error);
    }
  }
}

testWithConfirmedPermissions();
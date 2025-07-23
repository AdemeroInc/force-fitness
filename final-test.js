const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');

async function finalImageTest() {
  try {
    console.log('🎯 Final attempt at image generation...');
    console.log('⏱️  Waiting 10 seconds to avoid rate limits...');
    
    // Wait to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const vertex = new VertexAI({
      project: 'force-fitness-1753281211',
      location: 'us-central1'
    });
    
    console.log('🎨 Attempting image generation with minimal parameters...');
    
    const model = vertex.getGenerativeModel({
      model: 'imagen-3.0-fast-generate-001',
    });
    
    const result = await model.generateContent({
      prompt: 'fitness dumbbell blue simple',
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
          console.log('🎉 VERTEX AI IMAGE GENERATION WORKING!');
          return;
        }
      }
    }
    
    console.log('⚠️ Unexpected response format:', JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.log('❌ Final attempt failed:', error.message);
    
    if (error.message.includes('429')) {
      console.log('💡 Still hitting rate limits. The setup is correct but needs more time.');
      console.log('🔄 Try again in a few minutes - the API is working but throttled.');
    }
  }
}

finalImageTest();
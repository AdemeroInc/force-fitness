const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');

async function testDifferentModels() {
  try {
    console.log('🔍 Testing different model names and formats...');
    
    const vertex = new VertexAI({
      project: 'force-fitness-1753281211',
      location: 'us-central1'
    });
    
    // Different ways to reference Gemini models
    const geminiModels = [
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-pro',
      'gemini-pro-vision',
      'text-bison',
      'text-bison@001'
    ];
    
    console.log('\n📝 Testing text models...');
    for (const modelName of geminiModels) {
      try {
        console.log(`   Trying: ${modelName}`);
        const model = vertex.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        console.log(`   ✅ SUCCESS with ${modelName}:`, result.response.text().substring(0, 30) + '...');
        break; // Found working model
      } catch (error) {
        console.log(`   ❌ ${modelName}: ${error.message.substring(0, 50)}...`);
      }
    }
    
    // Different ways to reference image models
    const imageModels = [
      'imagen-3.0-fast-generate-001',
      'imagen-3.0-generate-001', 
      'imagegeneration@006',
      'imagegeneration@005',
      'imagen2'
    ];
    
    console.log('\n🎨 Testing image models...');
    for (const modelName of imageModels) {
      try {
        console.log(`   Trying: ${modelName}`);
        const model = vertex.getGenerativeModel({ model: modelName });
        
        const request = {
          prompt: 'A simple blue circle'
        };
        
        // Add model-specific parameters
        if (modelName.includes('imagen-3.0')) {
          request.aspectRatio = '1:1';
          request.personGeneration = 'dont_allow';
        }
        
        const result = await model.generateContent(request);
        console.log(`   ✅ SUCCESS with ${modelName}!`);
        
        // Save the image if we get data
        const response = result.response;
        if (response.candidates && response.candidates[0]) {
          const candidate = response.candidates[0];
          if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
            const part = candidate.content.parts[0];
            if (part.inlineData && part.inlineData.data) {
              const imageData = Buffer.from(part.inlineData.data, 'base64');
              fs.writeFileSync('test2.png', imageData);
              console.log(`   💾 Image saved as test2.png using ${modelName}`);
              return;
            }
          }
        }
        
      } catch (error) {
        console.log(`   ❌ ${modelName}: ${error.message.substring(0, 50)}...`);
      }
    }
    
    console.log('\n💡 None of the models worked. This suggests:');
    console.log('1. The project may need additional setup time after terms acceptance');
    console.log('2. There might be regional restrictions');
    console.log('3. The service account may need additional permissions');
    console.log('\nTry running this again in 5-10 minutes, or use Google AI Studio API directly.');
    
  } catch (error) {
    console.log('❌ Test failed:', error);
  }
}

testDifferentModels();
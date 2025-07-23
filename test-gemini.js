const { VertexAI } = require('@google-cloud/vertexai');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

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

async function generateTestText() {
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
    
    console.log('Getting Gemini model...');
    const model = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        maxOutputTokens: 100,
        temperature: 0.7,
      },
    });
    
    console.log('Generating text...');
    const prompt = 'Write a short motivational message for a fitness app user who just completed their first workout.';
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('Generated text:');
    console.log(response);
    
    console.log('\n✅ Gemini API is working correctly!');
    
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

generateTestText();
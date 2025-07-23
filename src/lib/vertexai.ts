import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { VertexAI } from '@google-cloud/vertexai';

// Initialize Secret Manager client
const secretClient = new SecretManagerServiceClient();

let vertexAI: VertexAI | null = null;
let projectId: string | null = null;

async function getSecret(secretName: string): Promise<string> {
  const projectId = await getProjectId();
  const [version] = await secretClient.accessSecretVersion({
    name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
  });
  
  const payload = version.payload?.data?.toString();
  if (!payload) {
    throw new Error(`Failed to retrieve secret: ${secretName}`);
  }
  
  return payload;
}

async function getProjectId(): Promise<string> {
  if (projectId) return projectId;
  
  try {
    projectId = await getSecret('gcp-project-id');
    return projectId;
  } catch (error) {
    console.error('Failed to get project ID from Secret Manager:', error);
    throw error;
  }
}

async function initializeVertexAI(): Promise<VertexAI> {
  if (vertexAI) return vertexAI;
  
  try {
    const project = await getProjectId();
    const location = 'us-central1';
    
    // Initialize Vertex AI
    // Note: Authentication should be handled by Application Default Credentials (ADC)
    // or by setting GOOGLE_APPLICATION_CREDENTIALS environment variable
    vertexAI = new VertexAI({
      project,
      location,
    });
    
    return vertexAI;
  } catch (error) {
    console.error('Failed to initialize Vertex AI:', error);
    throw error;
  }
}

export async function getGeminiModel(modelName: string = 'gemini-1.5-pro') {
  const vertex = await initializeVertexAI();
  return vertex.getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
  });
}

export async function getImagenModel() {
  const vertex = await initializeVertexAI();
  return vertex.getGenerativeModel({
    model: 'imagen-3.0-fast-generate-001',
  });
}

export async function generateText(prompt: string, modelName?: string) {
  try {
    const model = await getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No text generated');
    }
    return text;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

export async function generateImage(prompt: string, options?: {
  aspectRatio?: '1:1' | '9:16' | '16:9' | '3:4' | '4:3';
  negativePrompt?: string;
  personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all';
}) {
  try {
    const model = await getImagenModel();
    
    // Note: Imagen models in Vertex AI typically accept string prompts
    // Additional parameters like aspectRatio may need to be set differently
    const result = await model.generateContent(prompt);
    return result.response;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

export { initializeVertexAI };
# Imagen 3 Integration Guide

## Overview

This guide documents how to integrate Google's Imagen 3 AI image generation model with the Force Fitness application. Imagen 3 provides photorealistic image generation capabilities through Google Cloud's Vertex AI platform.

## Prerequisites

- Google Cloud Project: `force-fitness-1753281211`
- Firebase App Hosting enabled
- Vertex AI API enabled
- Secret Manager API enabled
- Service account with proper permissions
- Billing account linked

## Architecture

### Service Account Setup

The integration uses a dedicated service account: `vertex-ai-service@force-fitness-1753281211.iam.gserviceaccount.com`

**Required Roles**:
- `roles/aiplatform.admin` - Vertex AI Platform Admin
- `roles/aiplatform.user` - Vertex AI Platform User  
- `roles/firebasevertexai.admin` - Firebase Vertex AI Admin
- `roles/ml.developer` - AI Platform Developer

### Secret Management

Credentials are stored securely in Google Cloud Secret Manager:

- **Secret Name**: `vertex-ai-service-key`
- **Content**: Service account JSON key
- **Access**: Firebase service account has `secretmanager.secretAccessor` role

### API Endpoint

**Correct Endpoint**: Vertex AI Prediction API
```
https://us-central1-aiplatform.googleapis.com/v1/projects/force-fitness-1753281211/locations/us-central1/publishers/google/models/imagen-3.0-fast-generate-001:predict
```

**❌ Wrong Endpoint**: Generative Content API (used for text models like Gemini)
```
https://us-central1-aiplatform.googleapis.com/v1/projects/force-fitness-1753281211/locations/us-central1/publishers/google/models/imagen-3.0-fast-generate-001:generateContent
```

## Quota Configuration

### Required Quota
- **Quota Name**: `online_prediction_requests_per_base_model`
- **Region**: `us-central1`  
- **Base Model**: `imagen-3.0-fast-generate`
- **Current Limit**: 200 requests per minute

### Quota Location
Find in Google Cloud Console: IAM & Admin → Quotas & System Limits
Filter by: `online_prediction_requests_per_base_model`

## Implementation

### Dependencies

```json
{
  "@google-cloud/secret-manager": "^6.1.0",
  "jsonwebtoken": "^9.0.2",
  "node-fetch": "^2.6.7"
}
```

### Authentication Helper

```javascript
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

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
```

### Image Generation Function

```javascript
async function generateImage(prompt, options = {}) {
  try {
    const accessToken = await getAccessToken();
    const projectId = 'force-fitness-1753281211';
    const location = 'us-central1';
    
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-fast-generate-001:predict`;
    
    const requestBody = {
      instances: [{
        prompt: prompt
      }],
      parameters: {
        sampleCount: options.sampleCount || 1,
        aspectRatio: options.aspectRatio || '1:1',
        includeRaiReason: false,
        personGeneration: options.personGeneration || 'dont_allow'
      }
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Imagen 3 API Error: ${error.error?.message || 'Unknown error'}`);
    }
    
    const result = await response.json();
    
    // Extract image data
    if (result.predictions && result.predictions[0] && result.predictions[0].bytesBase64Encoded) {
      return Buffer.from(result.predictions[0].bytesBase64Encoded, 'base64');
    }
    
    throw new Error('No image data in response');
    
  } catch (error) {
    console.error('Image generation failed:', error);
    throw error;
  }
}
```

## Parameters Reference

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | string | Text description of the image to generate |

### Optional Parameters

| Parameter | Type | Default | Options | Description |
|-----------|------|---------|---------|-------------|
| `sampleCount` | number | 1 | 1-4 | Number of images to generate |
| `aspectRatio` | string | '1:1' | '1:1', '9:16', '16:9', '3:4', '4:3' | Image aspect ratio |
| `includeRaiReason` | boolean | false | true/false | Include safety filter reasons |
| `personGeneration` | string | 'dont_allow' | 'dont_allow', 'allow_adult' | Allow person generation |

### Aspect Ratio Options

- `'1:1'` - Square (1024x1024)
- `'9:16'` - Vertical/Mobile (720x1280) 
- `'16:9'` - Horizontal/Desktop (1280x720)
- `'3:4'` - Portrait (896x1280)
- `'4:3'` - Landscape (1280x896)

## Usage Examples

### Basic Image Generation

```javascript
// Generate simple fitness equipment
const imageBuffer = await generateImage('A blue fitness dumbbell on white background');
```

### Photorealistic Person

```javascript
// Generate realistic fitness trainer
const trainerImage = await generateImage(
  'Professional fitness trainer in a modern gym, photorealistic portrait, confident expression',
  {
    aspectRatio: '3:4',
    personGeneration: 'allow_adult'
  }
);
```

### Multiple Variations

```javascript
// Generate multiple workout scene variations
const workoutScenes = await generateImage(
  'Modern home gym setup with equipment, bright lighting, motivational atmosphere',
  {
    sampleCount: 4,
    aspectRatio: '16:9'
  }
);
```

### Save Image to File

```javascript
const fs = require('fs');

async function generateAndSave(prompt, filename) {
  try {
    const imageBuffer = await generateImage(prompt);
    fs.writeFileSync(filename, imageBuffer);
    console.log(`Image saved as ${filename}`);
  } catch (error) {
    console.error('Failed to generate image:', error);
  }
}

await generateAndSave('Fitness app logo design', 'logo.png');
```

## Error Handling

### Common Error Types

| Error Code | Description | Solution |
|------------|-------------|----------|
| 400 | Invalid parameters | Check prompt and parameter values |
| 401 | Authentication failed | Verify service account credentials |
| 403 | Insufficient permissions | Check IAM roles |
| 429 | Quota exceeded | Check quota limits and usage |
| 500 | Internal server error | Retry request |

### Error Handling Pattern

```javascript
async function safeGenerateImage(prompt, options = {}) {
  try {
    return await generateImage(prompt, options);
  } catch (error) {
    if (error.message.includes('429')) {
      console.log('Quota exceeded, implementing backoff...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await generateImage(prompt, options);
    } else if (error.message.includes('400')) {
      console.error('Invalid parameters:', error.message);
      throw new Error('Please check your prompt and parameters');
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
}
```

## Best Practices

### Prompt Engineering

**Effective Prompts**:
- Be specific and descriptive
- Include style keywords (photorealistic, professional, high-quality)
- Mention lighting and composition
- Specify background and setting

**Example Good Prompts**:
```javascript
// Good: Specific and detailed
"Professional fitness trainer demonstrating proper squat form, gym environment, natural lighting, instructional photography style"

// Bad: Too vague
"Person exercising"
```

### Performance Optimization

1. **Cache Generated Images**: Store results to avoid regenerating identical content
2. **Batch Requests**: Generate multiple variations in single request when possible
3. **Optimize Prompts**: Test and refine prompts for consistent results
4. **Handle Quotas**: Implement proper retry logic and rate limiting

### Security Considerations  

1. **Secure Credentials**: Never expose service account keys in client-side code
2. **Validate Inputs**: Sanitize user-provided prompts
3. **Rate Limiting**: Implement application-level rate limiting
4. **Content Filtering**: Use `includeRaiReason` for safety insights

## Integration with Firebase

### Server-Side Function

```javascript
// functions/src/generateImage.js
const functions = require('firebase-functions');
const { generateImage } = require('./imagen-helpers');

exports.generateFitnessImage = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  
  const { prompt, options } = data;
  
  try {
    const imageBuffer = await generateImage(prompt, options);
    return {
      success: true,
      imageData: imageBuffer.toString('base64')
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### Client-Side Usage

```typescript
// src/lib/image-generation.ts
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const generateFitnessImage = httpsCallable(functions, 'generateFitnessImage');

export async function createWorkoutImage(prompt: string): Promise<string> {
  try {
    const result = await generateFitnessImage({
      prompt,
      options: {
        aspectRatio: '16:9',
        personGeneration: 'allow_adult'
      }
    });
    
    return `data:image/png;base64,${result.data.imageData}`;
  } catch (error) {
    console.error('Image generation failed:', error);
    throw error;
  }
}
```

## Testing

The integration has been tested with:

- ✅ Basic equipment images (dumbbells, equipment)
- ✅ Photorealistic fitness trainers  
- ✅ Gym environments and scenes
- ✅ Various aspect ratios (1:1, 3:4, 16:9)
- ✅ Multiple image generation (sampleCount > 1)
- ✅ Error handling and quota management

### Test Files Generated

- `test2.png` - Basic fitness dumbbell (1024x1024)
- `test3.png` - Photorealistic fitness trainer (896x1280)

## Troubleshooting

### Issue: Getting 429 Quota Exceeded

**Solution**: Check that you're using the correct quota:
- Quota: `online_prediction_requests_per_base_model` 
- NOT: `generate_content_requests_per_minute_per_project_per_base_model`

### Issue: 404 Model Not Found

**Solution**: Ensure you're using the prediction endpoint, not generateContent:
```
✅ /models/imagen-3.0-fast-generate-001:predict
❌ /models/imagen-3.0-fast-generate-001:generateContent
```

### Issue: Invalid Argument - Seed Not Supported

**Solution**: Remove the `seed` parameter when watermarks are enabled:
```javascript
// ❌ Don't include seed parameter
parameters: {
  seed: 123, // This causes the error
  // ... other params
}

// ✅ Correct approach
parameters: {
  sampleCount: 1,
  aspectRatio: '1:1',
  includeRaiReason: false
}
```

## Next Steps

1. **Integration Planning**: Plan how to integrate image generation into specific app features
2. **UI/UX Design**: Design user interfaces for image generation features  
3. **Content Strategy**: Develop prompt templates for consistent branding
4. **Performance Monitoring**: Set up monitoring for quota usage and response times
5. **Cost Optimization**: Implement caching and optimize generation frequency

## Resources

- [Vertex AI Imagen Documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview)
- [Imagen 3 Model Reference](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api)
- [Google Cloud IAM Best Practices](https://cloud.google.com/iam/docs/using-iam-securely)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
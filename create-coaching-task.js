#\!/usr/bin/env node

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const app = initializeApp({
  credential: applicationDefault(),
  projectId: "force-fitness-1753281211"
});

const db = getFirestore(app);

async function createCoachingImprovementTask() {
  console.log("🆕 Creating AI Coaching Improvement task...");
  
  try {
    const taskData = {
      title: "Improve AI Coaching with Dynamic Responses and Streaming",
      description: "Enhance the AI coaching system to provide dynamic, contextual responses and implement streaming for real-time communication. Current issues: static responses, no OpenAI integration, no streaming. Requirements: real API integration, streaming responses, dynamic contextual replies, proper error handling, rate limiting, conversation memory, enhanced coach personalities.",
      priority: "high",
      status: "pending",
      assignee: "ai_agent",
      assignedTo: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      tags: ["ai-coaching", "openai-integration", "streaming", "backend", "real-time"],
      dependencies: [],
      createdBy: "claude-ai-agent",
      metadata: {
        complexity: "high",
        estimatedHours: 4,
        apiIntegration: true,
        streamingRequired: true
      }
    };
    
    const docRef = await db.collection("tasks").add(taskData);
    
    console.log("✅ Task created successfully: " + docRef.id);
    console.log("📋 Task: " + taskData.title);
    console.log("🏷️ Tags: " + taskData.tags.join(", "));
    console.log("⚡ Priority: " + taskData.priority);
    
    return { id: docRef.id, ...taskData };
    
  } catch (error) {
    console.error("❌ Error creating task:", error);
    return null;
  }
}

createCoachingImprovementTask().then(task => {
  if (task) {
    console.log("\\n🎉 AI Coaching improvement task ready for claiming\!");
  }
  process.exit(task ? 0 : 1);
});

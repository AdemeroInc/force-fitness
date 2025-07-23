import { NextRequest, NextResponse } from 'next/server';
import { AICoachingService } from '@/lib/ai-coaching';
import { UserProfile } from '@/types/coaching';

export async function POST(request: NextRequest) {
  try {
    const { message, userProfile, chatHistory } = await request.json();

    if (!message || !userProfile) {
      return NextResponse.json(
        { error: 'Message and user profile are required' },
        { status: 400 }
      );
    }

    const coachingService = AICoachingService.getInstance();

    // Check if we should stream the response
    const shouldStream = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key';

    if (shouldStream) {
      // Return streaming response
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const response = await coachingService.generateStreamingResponse(
              message,
              userProfile as UserProfile,
              chatHistory || []
            );

            // Stream the response
            for await (const chunk of response) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }

            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ error: 'Failed to generate response' })}\n\n`
              )
            );
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Return regular response for development
      const response = await coachingService.generateResponse(
        message,
        userProfile as UserProfile,
        chatHistory || []
      );

      return NextResponse.json({ content: response });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
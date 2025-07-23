import { useState, useCallback } from 'react';
import { UserProfile, ChatMessage } from '@/types/coaching';

interface UseStreamingChatProps {
  userProfile: UserProfile;
  onMessageReceived?: (message: ChatMessage) => void;
}

export function useStreamingChat({ userProfile, onMessageReceived }: UseStreamingChatProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');

  const sendMessage = useCallback(async (
    message: string,
    chatHistory: ChatMessage[] = []
  ): Promise<string> => {
    setIsStreaming(true);
    setStreamingMessage('');
    
    try {
      const response = await fetch('/api/coaching/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userProfile,
          chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      
      // Handle streaming response
      if (contentType?.includes('text/event-stream')) {
        return await handleStreamingResponse(response);
      } 
      // Handle regular JSON response (fallback for development)
      else {
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        return data.content;
      }
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
    }
  }, [userProfile]);

  const handleStreamingResponse = async (response: Response): Promise<string> => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';

    if (!reader) {
      throw new Error('No reader available');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return fullMessage;
            }
            
            try {
              const parsed = JSON.parse(data);
              
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              
              if (parsed.content) {
                fullMessage += parsed.content;
                setStreamingMessage(fullMessage);
                
                // Trigger callback for real-time updates
                if (onMessageReceived) {
                  const tempMessage: ChatMessage = {
                    id: `temp-${Date.now()}`,
                    userId: userProfile.userId,
                    coachId: userProfile.selectedCoach,
                    content: fullMessage,
                    role: 'coach',
                    timestamp: new Date(),
                    messageType: 'text'
                  };
                  onMessageReceived(tempMessage);
                }
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
      
      return fullMessage;
    } finally {
      reader.releaseLock();
    }
  };

  return {
    sendMessage,
    isStreaming,
    streamingMessage,
  };
}
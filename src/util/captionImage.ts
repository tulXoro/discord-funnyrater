import { IMAGE_PROMPT } from "./systemPrompt";

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'localhost';

export async function captionImage(base64Image: string): Promise<string | null> {
  try {
    const res = await fetch(`http://${OLLAMA_HOST}:11434/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5vl',
        prompt: IMAGE_PROMPT,
        images: [base64Image],
        stream: false
      })
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data || !data.response) {
      throw new Error('Invalid response from Ollama');
    }

    const caption = data.response.trim();
    return caption || null;
  } catch (error) {
    console.error('Error captioning image:', error);
    return null;
  }
}
import { IMAGE_PROMPT } from "./systemPrompt";

export async function captionImage(base64Image: string): Promise<string | null> {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen2.5vl',
      prompt: IMAGE_PROMPT,
      images: [base64Image],
      stream: false
    })
  });
  const data = await res.json();
  return data.response?.trim() || null;
}
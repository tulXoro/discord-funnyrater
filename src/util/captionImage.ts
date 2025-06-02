export async function captionImage(base64Image: string): Promise<string | null> {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llava',
      prompt: "Briefly judge this image as a meme critic. Consider all types of humor, including dark humor, and do not be overly cautious or judgmental. Rate how funny or meme-worthy it is. Be concise and direct.",
      images: [base64Image],
      stream: false
    })
  });
  const data = await res.json();
  return data.response?.trim() || null;
}
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";

export async function detectEmotion(imageBase64: string): Promise<string> {
    try {
        const response = await fetch('/api/detect-emotion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageBase64 })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }

        return data.emotion;
    } catch (error) {
        console.error('Error detecting emotion:', error);
        return '';
    }
}

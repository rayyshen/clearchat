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

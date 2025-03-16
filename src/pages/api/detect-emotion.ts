import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { imageBase64 } = req.body;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

        const prompt = "What emotion is the person in the picture showing in one word that is a noun?";
        const imageParts = [{
            inlineData: {
                data: imageBase64.split(',')[1],
                mimeType: 'image/jpeg'
            }
        }];

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const emotion = response.text();
        
        res.status(200).json({ emotion });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to detect emotion',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

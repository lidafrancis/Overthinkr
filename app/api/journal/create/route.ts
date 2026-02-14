import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Session from '@/lib/models/Session';
import { getUser } from '@/lib/auth';
import { analyzeSentiment } from '@/lib/sentiment';

export async function POST(req: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: 'Text entry is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // 1. Analyze Sentiment
        const sentiment = analyzeSentiment(text);

        // 2. Calculate Initial Stress Score (0-100)
        // Map compound score (-1 to 1) to Stress (100 to 0)
        // -1 (Negative) -> 100 Stress
        // 1 (Positive) -> 0 Stress
        const initialStressScore = Math.round((1 - sentiment.score) * 50);

        // 3. Create Session (LOCKED)
        const newSession = await Session.create({
            userId: user.id,
            entryText: text,
            initialStressScore,
            sentimentData: sentiment,
            status: 'LOCKED',
        });

        return NextResponse.json({
            success: true,
            sessionId: newSession._id,
            initialStressScore,
            status: 'LOCKED'
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

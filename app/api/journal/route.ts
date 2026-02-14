import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Session from '@/lib/models/Session';
import { getUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { entryText, sentimentData } = await req.json();

        if (!entryText) {
            return NextResponse.json(
                { error: 'Entry text is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Create a new session
        const newSession = await Session.create({
            userId: user.id,
            entryText,
            sentimentData, // Optional, can be passed if client does analysis or if we add server-side later
            status: 'LOCKED', // Initially locked until analysis/tasks? Or maybe UNLOCKED?
            // For now, let's say it starts as LOCKED and requires tasks to UNLOCK insights.
            // But maybe the user just wants to save.
            // Let's default to LOCKED as per schema default.
        });

        return NextResponse.json({ success: true, session: newSession });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Get all sessions for the user, sorted by date desc
        const sessions = await Session.find({ userId: user.id }).sort({
            createdAt: -1,
        });

        return NextResponse.json({ success: true, sessions });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

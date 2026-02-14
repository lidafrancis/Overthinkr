import Link from 'next/link';

// NOTE: This is a script, run with ts-node or similar, or just hit an API route.
// For this environment, I'll make a route for seeding: /api/seed

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/lib/models/Task';

export async function GET() {
    await dbConnect();

    const tasks = [
        { title: 'Box Breathing', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.', type: 'breathing', duration: 60, gemReward: 5 },
        { title: 'Quick Walk', description: 'Walk around the room or outside.', type: 'movement', duration: 120, gemReward: 10 },
        { title: 'Water Break', description: 'Drink a full glass of water.', type: 'other', duration: 30, gemReward: 3 },
        { title: 'Identify 5 Things', description: 'Find 5 blue things in the room.', type: 'reflection', duration: 45, gemReward: 5 },
        { title: 'Shoulder Roll', description: 'Release tension in your shoulders.', type: 'movement', duration: 30, gemReward: 2 },
    ];

    await Task.deleteMany({}); // Clear existing
    await Task.insertMany(tasks);

    return NextResponse.json({ success: true, count: tasks.length });
}

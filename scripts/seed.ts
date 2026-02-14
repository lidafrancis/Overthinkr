
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

import Task from '../lib/models/Task';

async function seed() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected.');

    const tasks = [
        { title: 'Box Breathing', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.', type: 'breathing', duration: 10, gemReward: 5 },
        { title: 'Quick Walk', description: 'Walk around the room or outside.', type: 'movement', duration: 15, gemReward: 10 },
        { title: 'Water Break', description: 'Drink a full glass of water.', type: 'other', duration: 5, gemReward: 3 },
        { title: 'Identify 5 Things', description: 'Find 5 blue things in the room.', type: 'reflection', duration: 10, gemReward: 5 },
        { title: 'Shoulder Roll', description: 'Release tension in your shoulders.', type: 'movement', duration: 5, gemReward: 2 },
    ];

    console.log('Clearing existing tasks...');
    await Task.deleteMany({});

    console.log('Inserting verification tasks...');
    await Task.insertMany(tasks);

    console.log('Done! Added ' + tasks.length + ' tasks.');
    await mongoose.disconnect();
}

seed().catch(console.error);

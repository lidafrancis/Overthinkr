import mongoose from 'mongoose';
import Task from '../lib/models/Task';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable');
    process.exit(1);
}

const gameTask = {
    title: 'Pop the Stress',
    description: 'Clear your mind by popping the floating bubbles. Focus on releasing tension with each tap.',
    type: 'game',
    duration: 30,
    gemReward: 15,
};

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connecting to MongoDB...');

        // Check if game already exists
        const existing = await Task.findOne({ title: gameTask.title });
        if (existing) {
            console.log('Game task already exists.');
        } else {
            await Task.create(gameTask);
            console.log('Added Bubble Game task!');
        }

        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
}

seed();

import mongoose from 'mongoose';
import Task from '../lib/models/Task';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const tasks = await Task.find({});
    console.log(`Found ${tasks.length} tasks:`);
    tasks.forEach(t => console.log(`- [${t.type}] ${t.title}`));
    process.exit(0);
}

check();

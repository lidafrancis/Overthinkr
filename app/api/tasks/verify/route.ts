import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/lib/models/Task';
import Session from '@/lib/models/Session';
import User from '@/lib/models/User';
import GemTransaction from '@/lib/models/GemTransaction';
import { getUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sessionId, taskId, duration } = await req.json();

        if (!sessionId || !taskId || !duration) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Transaction logic removed for standalone MongoDB compatibility

        try {
            const task = await Task.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            const journalSession = await Session.findOne({
                _id: sessionId,
                userId: user.id,
            });

            if (!journalSession) {
                throw new Error('Journal session not found');
            }

            // Check if already completed
            const alreadyCompleted = journalSession.tasksCompleted.some(
                (t: any) => t.taskId.toString() === taskId
            );

            if (alreadyCompleted) {
                // Idempotency: just return success if already done?
                // For now, proceed (logic allows repeats in MVP)
            }

            journalSession.tasksCompleted.push({
                taskId: task._id,
                timeSpent: duration,
                completedAt: new Date(),
            } as any);

            await journalSession.save();

            const gemReward = task.gemReward;
            await User.findByIdAndUpdate(
                user.id,
                { $inc: { gems: gemReward } }
            );

            await GemTransaction.create({
                userId: user.id,
                amount: gemReward,
                type: 'EARN',
                description: `Completed task: ${task.title}`,
                relatedEntityId: task._id,
                relatedEntityType: 'TASK',
            });

            // Re-fetch user to get updated balance
            const updatedUser = await User.findById(user.id);

            return NextResponse.json({
                success: true,
                gemsEarned: gemReward,
                newBalance: updatedUser?.gems || 0,
            });

        } catch (error: any) {
            console.error('Verify Logic Error:', error);
            throw error;
        }
    } catch (error: any) {
        console.error('Verify Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Session from '@/lib/models/Session';
import { getUser } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await dbConnect();

        const session = await Session.findOne({ _id: id, userId: user.id });

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Logic for required gems/tasks
        // For now, let's say unlock cost is 50 gems OR completing specific tasks reduces it?
        // User Requirement: "required gem cost/tasks"
        // Let's implement a dynamic cost based on initial stress.
        // Higher stress = more gems to unlock immediately, OR do tasks to earn gems to pay for it.
        // Default unlock cost: 20 gems.
        const unlockCost = 20;

        return NextResponse.json({
            success: true,
            status: session.status,
            initialStressScore: session.initialStressScore,
            unlockCost,
            tasksCompleted: session.tasksCompleted,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

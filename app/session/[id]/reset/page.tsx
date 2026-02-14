import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Session from '@/lib/models/Session';
import User from '@/lib/models/User';
import Task from '@/lib/models/Task';
import ResetView from './ResetView';

async function getData(sessionId: string) {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    await dbConnect();

    // Verify session belongs to user
    const journalSession = await Session.findOne({
        _id: sessionId,
        userId: session.user.id
    });

    if (!journalSession) return null;

    // If already unlocked, redirect to result
    if (journalSession.status === 'UNLOCKED') {
        return { redirect: `/session/${sessionId}/result` };
    }

    const user = await User.findById(session.user.id);
    const tasks = await Task.find({}).limit(20); // Fetch more tasks to include games

    // Calculate dynamic cost based on initial stress (if we implemented that logic)
    const unlockCost = 20;

    return {
        journalSession,
        user,
        tasks: JSON.parse(JSON.stringify(tasks)), // Serializing
        unlockCost
    };
}

export default async function ResetPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const data = await getData(id);

    const res = data as any;
    if (!res) redirect('/dashboard');
    if (res.redirect) redirect(res.redirect);
    if (!res.journalSession) redirect('/dashboard');

    // Explicitly cast or check to satisfy TS
    const { journalSession, user, tasks, unlockCost } = data as any;

    return (
        <div className="min-h-screen p-6 flex items-center justify-center">
            <ResetView
                sessionId={id}
                initialStressScore={journalSession.initialStressScore || 50}
                unlockCost={unlockCost}
                userGems={user?.gems || 0}
                tasks={tasks}
            />
        </div>
    );
}

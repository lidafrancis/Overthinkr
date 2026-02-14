import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Session from '@/lib/models/Session';

async function getData() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    await dbConnect();
    const user = await User.findById(session.user.id);
    // Get recent locked sessions? or just last session?
    // Let's get the last 3 sessions
    const recentSessions = await Session.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .limit(3);

    return { user, recentSessions };
}

export default async function DashboardPage() {
    const data = await getData();

    if (!data) {
        redirect('/login');
    }

    const { user, recentSessions } = data;

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-blue-400">
                        Hi, {user?.name.split(' ')[0]}
                    </h1>
                    <p className="text-white/60 mt-2 text-lg">Ready to check in with yourself?</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                        <span className="text-xl">💎</span>
                        <span className="font-bold">{user?.gems}</span>
                    </div>
                    {/* Logout button could go here */}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="flex flex-col items-center text-center p-10 hover:bg-white/10 transition-all border-indigo-500/30">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-indigo-500/30">
                        📝
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Start Reflection</h2>
                    <p className="text-white/60 mb-8">Take a moment to unload your thoughts and reset.</p>
                    <Link href="/journal" className="w-full">
                        <Button className="w-full text-lg">Begin Journey</Button>
                    </Link>
                </Card>

                <Card className="flex flex-col justify-center p-8 border-teal-500/20">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-teal-300">📅</span> Recent History
                    </h2>
                    <div className="space-y-4">
                        {recentSessions.length === 0 ? (
                            <p className="text-white/40 italic">No reflections yet.</p>
                        ) : (
                            recentSessions.map((s) => (
                                <div key={s._id.toString()} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div>
                                        <div className="text-sm font-medium text-white/80">
                                            {new Date(s.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-white/50 truncate max-w-[200px]">
                                            {s.entryText}
                                        </div>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full border ${s.status === 'UNLOCKED'
                                            ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                            : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                                        }`}>
                                        {s.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Link href="/history" className="mt-auto pt-6 text-center text-sm text-white/50 hover:text-white transition-colors">
                        View all history →
                    </Link>
                </Card>
            </div>
        </div>
    );
}

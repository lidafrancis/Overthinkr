import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import dbConnect from '@/lib/db';
import Session from '@/lib/models/Session';

async function getData(sessionId: string) {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    await dbConnect();

    const journalSession = await Session.findOne({
        _id: sessionId,
        userId: session.user.id
    });

    if (!journalSession || journalSession.status !== 'UNLOCKED') {
        return { redirect: '/dashboard' };
    }

    return { journalSession };
}

export default async function ResultPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const data = await getData(id);

    if (!data) redirect('/dashboard');
    if ('redirect' in data && data.redirect) redirect(data.redirect);

    const { journalSession } = data as { journalSession: any };
    if (!journalSession) redirect('/dashboard');
    const initial = journalSession.initialStressScore || 0;
    const final = journalSession.finalStressScore || 0;

    const diff = initial - final;
    const percentChange = initial > 0 ? Math.round((diff / initial) * 100) : 0;
    const isImprovement = diff > 0;

    return (
        <div className="min-h-screen p-6 flex items-center justify-center max-w-4xl mx-auto">
            <div className="w-full space-y-8">
                <header className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-teal-400">
                        Session Complete
                    </h1>
                    <p className="text-white/60 mt-2">Here is your emotional shift.</p>
                </header>

                <Card className="p-8">
                    <h2 className="text-xl font-bold mb-8 text-center">Stress Level Comparison</h2>

                    <div className="flex items-end justify-center gap-12 h-64 mb-12">
                        {/* Before */}
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="text-2xl font-bold text-red-400">{initial}</div>
                            <div
                                className="w-16 bg-gradient-to-t from-red-500/50 to-orange-500/80 rounded-t-xl transition-all group-hover:opacity-100 opacity-80"
                                style={{ height: `${Math.max(initial * 2, 20)}px` }}
                            />
                            <div className="text-sm text-white/50 uppercase tracking-widest">Before</div>
                        </div>

                        {/* After */}
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="text-2xl font-bold text-green-400">{final}</div>
                            <div
                                className="w-16 bg-gradient-to-t from-teal-500/50 to-green-500/80 rounded-t-xl transition-all group-hover:opacity-100 opacity-80"
                                style={{ height: `${Math.max(final * 2, 20)}px` }}
                            />
                            <div className="text-sm text-white/50 uppercase tracking-widest">Now</div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 text-center border border-white/5">
                        <h3 className="text-lg font-bold mb-2">
                            {isImprovement
                                ? `You reduced your stress by ${percentChange}%`
                                : 'Your stress levels remained stable.'}
                        </h3>
                        <p className="text-white/70">
                            {isImprovement
                                ? "Great work. The physical reset helped downregulate your nervous system."
                                : "That's okay. Sometimes awareness is the first step. Be gentle with yourself."}
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <h4 className="font-bold text-indigo-300 mb-1">Keywords Detected</h4>
                            <div className="flex flex-wrap gap-2">
                                {journalSession.sentimentData?.keywords?.map((k: string) => (
                                    <span key={k} className="text-xs bg-indigo-500/20 px-2 py-1 rounded text-indigo-200">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/20">
                            <h4 className="font-bold text-teal-300 mb-1">Guidance</h4>
                            <p className="text-sm text-white/70">
                                Avoid big decisions for the next hour. Drink some water.
                            </p>
                        </div>
                    </div>
                </Card>

                <div className="flex gap-4 justify-center">
                    <Link href="/dashboard">
                        <Button variant="secondary">Return Home</Button>
                    </Link>
                    <Link href="/journal">
                        <Button>New Session</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

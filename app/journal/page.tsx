import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function JournalPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                <h1 className="text-3xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-400">
                    How would you like to reflect today?
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link href="/journal/write" className="group">
                        <Card className="h-full p-10 flex flex-col items-center text-center transition-all group-hover:bg-white/10 group-hover:scale-105 border-indigo-500/30">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl mb-6 shadow-lg shadow-indigo-500/40">
                                📝
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Write Freely</h2>
                            <p className="text-white/60">
                                Just let it all out. No structure, no judgment. We'll help you process it.
                            </p>
                        </Card>
                    </Link>

                    {/* Quick Check-in (Future implementation or simpler version) */}
                    <button className="group relative opacity-70 hover:opacity-100 transition-opacity">
                        <Card className="h-full p-10 flex flex-col items-center text-center border-white/10 bg-white/5">
                            <div className="absolute top-4 right-4 bg-white/10 text-xs px-2 py-1 rounded-full border border-white/10">
                                Coming Soon
                            </div>
                            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">
                                ⚡
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-white/50">Quick Check-in</h2>
                            <p className="text-white/40">
                                Guided questions to identify your state of mind in seconds.
                            </p>
                        </Card>
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

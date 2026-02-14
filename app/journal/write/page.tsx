'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function JournalWritePage() {
    const router = useRouter();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/journal/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (res.ok) {
                const data = await res.json();
                // Redirect to the Reset Space (Gem Page)
                router.push(`/session/${data.sessionId}/reset`);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save entry');
                setLoading(false);
            }
        } catch (err) {
            setError('An error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-3xl w-full">
                <header className="mb-8 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white/90">What's on your mind?</h1>
                    <p className="text-white/50">Don't worry about grammar or structure.</p>
                </header>

                <Card className="p-1">
                    <textarea
                        className="w-full h-[400px] bg-transparent text-lg md:text-xl p-6 md:p-8 text-white placeholder-white/20 focus:outline-none resize-none leading-relaxed"
                        placeholder="I'm feeling..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                    />
                    <div className="p-4 border-t border-white/5 flex justify-between items-center bg-black/20 rounded-b-xl">
                        <div className="text-white/30 text-sm">
                            {text.length} characters
                        </div>
                        <div className="flex gap-4">
                            {error && <span className="text-red-400 text-sm my-auto">{error}</span>}
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !text.trim()}
                                className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 ${loading ? 'opacity-80' : ''}`}
                            >
                                {loading ? 'Analyzing...' : 'Analyze & Reset →'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

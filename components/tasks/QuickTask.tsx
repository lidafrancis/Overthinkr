'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface QuickTaskProps {
    title: string;
    description?: string;
    duration: number; // in seconds
    onComplete: () => void;
    onCancel: () => void;
}

export default function QuickTask({
    title,
    description,
    duration,
    onComplete,
    onCancel
}: QuickTaskProps) {
    const [timeRemaining, setTimeRemaining] = useState(duration);
    const [progress, setProgress] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started) return;

        const startTime = Date.now();
        const endTime = startTime + (duration * 1000);

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, (endTime - now) / 1000);
            const elapsed = duration - remaining;

            setTimeRemaining(Math.ceil(remaining));
            setProgress((elapsed / duration) * 100);

            if (remaining <= 0) {
                clearInterval(interval);
                onComplete();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onComplete, started]);

    const getTaskIcon = () => {
        if (title.toLowerCase().includes('water')) return '💧';
        if (title.toLowerCase().includes('identify') || title.toLowerCase().includes('5 things')) return '👀';
        if (title.toLowerCase().includes('deep')) return '😮‍💨';
        return '⚡';
    };

    const getTaskInstructions = () => {
        if (title.toLowerCase().includes('water')) {
            return 'Take a moment to hydrate. Grab your water and take a few sips.';
        }
        if (title.toLowerCase().includes('identify') || title.toLowerCase().includes('5 things')) {
            return 'Look around and identify 5 things you can see. This grounds you in the present moment.';
        }
        if (title.toLowerCase().includes('deep')) {
            return 'Take slow, deep breaths. Focus on the sensation of breathing.';
        }
        return description || 'Take a quick break to reset.';
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 text-center space-y-6">
                <div className="text-6xl">
                    {getTaskIcon()}
                </div>

                <h2 className="text-2xl font-bold">{title}</h2>

                <p className="text-white/70">{getTaskInstructions()}</p>

                {!started ? (
                    <Button
                        onClick={() => setStarted(true)}
                        className="w-full text-lg py-6"
                    >
                        Start Task
                    </Button>
                ) : (
                    <>
                        <div className="relative w-40 h-40 mx-auto">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="72"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="10"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="72"
                                    fill="none"
                                    stroke="#2dd4bf"
                                    strokeWidth="10"
                                    strokeDasharray={452}
                                    strokeDashoffset={452 - (452 * progress) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-100"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold">{timeRemaining}</span>
                                <span className="text-xs text-white/60">seconds</span>
                            </div>
                        </div>

                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-teal-400 to-blue-400 h-2 rounded-full transition-all duration-100"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </>
                )}

                <Button
                    onClick={onCancel}
                    variant="secondary"
                    className="w-full"
                >
                    {started ? 'Skip' : 'Cancel'}
                </Button>
            </Card>
        </div>
    );
}

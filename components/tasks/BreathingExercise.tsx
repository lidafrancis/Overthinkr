'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface BreathingExerciseProps {
    duration: number; // in seconds
    onComplete: () => void;
    onCancel: () => void;
}

export default function BreathingExercise({
    duration,
    onComplete,
    onCancel
}: BreathingExerciseProps) {
    const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
    const [phaseProgress, setPhaseProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(duration);

    const phaseDuration = 4; // 4 seconds per phase for box breathing
    const cycleTime = phaseDuration * 4; // 16 seconds total per cycle

    useEffect(() => {
        const startTime = Date.now();
        const endTime = startTime + (duration * 1000);

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = (now - startTime) / 1000;
            const remaining = Math.max(0, (endTime - now) / 1000);

            setTimeRemaining(Math.ceil(remaining));

            // Calculate current phase
            const cyclePosition = elapsed % cycleTime;
            const phaseIndex = Math.floor(cyclePosition / phaseDuration);
            const phaseElapsed = cyclePosition % phaseDuration;
            const progress = (phaseElapsed / phaseDuration) * 100;

            setPhaseProgress(progress);

            switch (phaseIndex) {
                case 0:
                    setPhase('inhale');
                    break;
                case 1:
                    setPhase('hold1');
                    break;
                case 2:
                    setPhase('exhale');
                    break;
                case 3:
                    setPhase('hold2');
                    break;
            }

            if (remaining <= 0) {
                clearInterval(interval);
                onComplete();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onComplete]);

    const phaseText = {
        inhale: 'Breathe In',
        hold1: 'Hold',
        exhale: 'Breathe Out',
        hold2: 'Hold',
    };

    const phaseColor = {
        inhale: 'from-blue-400 to-cyan-400',
        hold1: 'from-purple-400 to-pink-400',
        exhale: 'from-green-400 to-teal-400',
        hold2: 'from-yellow-400 to-orange-400',
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 text-center space-y-6">
                <h2 className="text-2xl font-bold">Box Breathing</h2>

                <div className="relative w-64 h-64 mx-auto">
                    {/* Animated breathing circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className={`rounded-full bg-gradient-to-br ${phaseColor[phase]} transition-all duration-1000 ease-in-out`}
                            style={{
                                width: phase === 'inhale' ? '100%' : phase === 'exhale' ? '50%' : '75%',
                                height: phase === 'inhale' ? '100%' : phase === 'exhale' ? '50%' : '75%',
                                opacity: 0.3,
                            }}
                        />
                    </div>

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className={`text-3xl font-bold bg-gradient-to-r ${phaseColor[phase]} bg-clip-text text-transparent`}>
                            {phaseText[phase]}
                        </p>
                        <div className="mt-4 text-sm text-white/60">
                            {Math.ceil((phaseDuration - (phaseProgress / 100 * phaseDuration)))}s
                        </div>
                    </div>

                    {/* Progress ring */}
                    <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="4"
                        />
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={754}
                            strokeDashoffset={754 - (754 * phaseProgress) / 100}
                            className={`text-${phase === 'inhale' ? 'blue' : phase === 'exhale' ? 'green' : 'purple'}-400 transition-all duration-100`}
                        />
                    </svg>
                </div>

                <div className="space-y-2">
                    <p className="text-white/60 text-sm">Time remaining: {timeRemaining}s</p>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-teal-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${((duration - timeRemaining) / duration) * 100}%` }}
                        />
                    </div>
                </div>

                <Button
                    onClick={onCancel}
                    variant="secondary"
                    className="w-full"
                >
                    Skip
                </Button>
            </Card>
        </div>
    );
}

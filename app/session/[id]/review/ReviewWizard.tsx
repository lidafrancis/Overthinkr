'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const QUESTIONS = [
    { id: 'stress', label: 'Emotional Weight', min: 'Light', max: 'Heavy' },
    { id: 'tension', label: 'Body Tension', min: 'Relaxed', max: 'Tight' },
    { id: 'speed', label: 'Thought Speed', min: 'Calm', max: 'Racing' },
    { id: 'energy', label: 'Energy Shift', min: 'Drained', max: 'Charged' },
    { id: 'mood', label: 'Mood Direction', min: 'Down', max: 'Up' },
    { id: 'urgency', label: 'Urgency Level', min: 'Paused', max: 'Critical' },
    { id: 'impact', label: 'Final Impact', min: 'None', max: 'High' },
];

export default function ReviewWizard({ sessionId, unlockCost }: { sessionId: string; unlockCost: number }) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/session/${sessionId}/unlock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gemsSpent: unlockCost,
                    postAssessmentData: answers,
                }),
            });

            if (res.ok) {
                router.push(`/session/${sessionId}/result`);
            } else {
                console.error('Failed to unlock');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currentQ = QUESTIONS[step];
    const progress = ((step + 1) / QUESTIONS.length) * 100;

    return (
        <div className="max-w-xl mx-auto min-h-screen flex flex-col justify-center p-6">
            <div className="mb-8">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-right text-sm text-white/50 mt-2">
                    Step {step + 1} of {QUESTIONS.length}
                </div>
            </div>

            <Card className="p-10 text-center">
                <h2 className="text-2xl font-bold mb-8">{currentQ.label}</h2>

                <div className="flex justify-between text-sm text-white/50 mb-4 px-2">
                    <span>{currentQ.min}</span>
                    <span>{currentQ.max}</span>
                </div>

                <input
                    type="range"
                    min="1"
                    max="10"
                    value={answers[currentQ.id] || 5}
                    onChange={(e) => setAnswers({ ...answers, [currentQ.id]: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer mb-12 accent-teal-400"
                />

                <Button onClick={handleNext} disabled={loading} className="w-full">
                    {step === QUESTIONS.length - 1 ? (loading ? 'Unlocking Results...' : 'Show Results') : 'Next'}
                </Button>
            </Card>
        </div>
    );
}

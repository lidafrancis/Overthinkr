'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import BubbleGame from '@/components/games/BubbleGame';

interface Task {
    _id: string;
    title: string;
    description: string;
    duration: number;
    gemReward: number;
    type: string;
}

interface ResetViewProps {
    sessionId: string;
    initialStressScore: number;
    unlockCost: number;
    userGems: number;
    tasks: Task[];
}

export default function ResetView({
    sessionId,
    initialStressScore,
    unlockCost,
    userGems,
    tasks,
}: ResetViewProps) {
    const router = useRouter();
    const [currentGems, setCurrentGems] = useState(userGems);
    const [displayGems, setDisplayGems] = useState(userGems);
    const [completingTask, setCompletingTask] = useState<string | null>(null);
    const [showGame, setShowGame] = useState(false);
    const [activeGameTask, setActiveGameTask] = useState<Task | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [taskProgress, setTaskProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');

    const handleCompleteTask = async (task: Task) => {
        if (task.type === 'game') {
            setActiveGameTask(task);
            setShowGame(true);
            setCompletingTask(task._id);
            return;
        }

        setActiveTask(task);
        setCompletingTask(task._id);
        setTaskProgress(0);
        setTimeRemaining(task.duration);
    };

    // Task timer effect
    useEffect(() => {
        if (!activeTask || activeTask.type === 'game') return;

        const duration = activeTask.duration * 1000;
        const startTime = Date.now();
        const interval = 50;

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));

            setTaskProgress(progress);
            setTimeRemaining(remaining);

            // Breathing phase calculation
            if (activeTask.type === 'breathing') {
                const phaseDuration = 4;
                const cycleTime = phaseDuration * 4;
                const cyclePosition = (elapsed / 1000) % cycleTime;
                const phaseIndex = Math.floor(cyclePosition / phaseDuration);

                const phases: ('inhale' | 'hold1' | 'exhale' | 'hold2')[] = ['inhale', 'hold1', 'exhale', 'hold2'];
                setBreathingPhase(phases[phaseIndex]);
            }

            if (progress >= 100) {
                clearInterval(timer);
                handleTaskComplete();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [activeTask]);

    const handleTaskComplete = async () => {
        if (!activeTask) return;

        try {
            const res = await fetch('/api/tasks/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    taskId: activeTask._id,
                    duration: activeTask.duration,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setCurrentGems(data.newBalance);
                animateGemIncrease(displayGems, data.newBalance);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActiveTask(null);
            setCompletingTask(null);
            setTaskProgress(0);
        }
    };

    const animateGemIncrease = (from: number, to: number) => {
        const duration = 800;
        const steps = 30;
        const increment = (to - from) / steps;
        let current = from;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;

            if (step >= steps) {
                setDisplayGems(to);
                clearInterval(timer);
            } else {
                setDisplayGems(Math.round(current));
            }
        }, duration / steps);
    };

    const onGameComplete = async () => {
        if (!activeGameTask) return;

        try {
            const res = await fetch('/api/tasks/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    taskId: activeGameTask._id,
                    duration: activeGameTask.duration,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setCurrentGems(data.newBalance);
                animateGemIncrease(displayGems, data.newBalance);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setShowGame(false);
            setActiveGameTask(null);
            setCompletingTask(null);
        }
    };

    const handleUnlock = () => {
        router.push(`/session/${sessionId}/review`);
    };

    const progress = Math.min((displayGems / unlockCost) * 100, 100);
    const canUnlock = currentGems >= unlockCost;

    // Render task instructions and UI
    const renderTaskModal = () => {
        if (!activeTask) return null;

        if (activeTask.type === 'breathing') {
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
                        <h2 className="text-2xl font-bold">{activeTask.title}</h2>

                        <div className="relative w-64 h-64 mx-auto">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className={`rounded-full bg-gradient-to-br ${phaseColor[breathingPhase]} transition-all duration-1000 ease-in-out`}
                                    style={{
                                        width: breathingPhase === 'inhale' ? '100%' : breathingPhase === 'exhale' ? '50%' : '75%',
                                        height: breathingPhase === 'inhale' ? '100%' : breathingPhase === 'exhale' ? '50%' : '75%',
                                        opacity: 0.3,
                                    }}
                                />
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className={`text-3xl font-bold bg-gradient-to-r ${phaseColor[breathingPhase]} bg-clip-text text-transparent`}>
                                    {phaseText[breathingPhase]}
                                </p>
                                <div className="mt-4 text-sm text-white/60">
                                    {timeRemaining}s remaining
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-teal-400 to-blue-400 h-2 rounded-full transition-all duration-100"
                                style={{ width: `${taskProgress}%` }}
                            />
                        </div>

                        <Button
                            onClick={() => {
                                setActiveTask(null);
                                setCompletingTask(null);
                            }}
                            variant="secondary"
                            className="w-full"
                        >
                            Skip
                        </Button>
                    </Card>
                </div>
            );
        }

        if (activeTask.type === 'movement') {
            const getActivityEmoji = () => {
                if (activeTask.title.toLowerCase().includes('walk')) return '🚶';
                if (activeTask.title.toLowerCase().includes('stretch')) return '🧘';
                if (activeTask.title.toLowerCase().includes('shoulder')) return '💪';
                if (activeTask.title.toLowerCase().includes('jump')) return '🤾';
                return '🏃';
            };

            return (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md p-8 text-center space-y-6">
                        <div className="text-6xl animate-bounce">
                            {getActivityEmoji()}
                        </div>

                        <h2 className="text-2xl font-bold">{activeTask.title}</h2>

                        <p className="text-white/70">{activeTask.description}</p>

                        <div className="relative w-48 h-48 mx-auto">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                                <circle
                                    cx="96" cy="96" r="88" fill="none" stroke="#2dd4bf" strokeWidth="12"
                                    strokeDasharray={553}
                                    strokeDashoffset={553 - (553 * taskProgress) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-100"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold">{timeRemaining}</span>
                                <span className="text-sm text-white/60 mt-1">seconds</span>
                            </div>
                        </div>

                        <p className="text-white/80">Keep going! You're doing great 💪</p>

                        <Button
                            onClick={() => {
                                setActiveTask(null);
                                setCompletingTask(null);
                            }}
                            variant="secondary"
                            className="w-full"
                        >
                            Skip
                        </Button>
                    </Card>
                </div>
            );
        }

        // Quick tasks (water, 5 things, etc.)
        const getTaskIcon = () => {
            if (activeTask.title.toLowerCase().includes('water')) return '💧';
            if (activeTask.title.toLowerCase().includes('identify') || activeTask.title.toLowerCase().includes('5 things')) return '👀';
            return '⚡';
        };

        const getTaskInstructions = () => {
            if (activeTask.title.toLowerCase().includes('water')) {
                return 'Take a moment to hydrate. Grab your water and take a few sips.';
            }
            if (activeTask.title.toLowerCase().includes('identify') || activeTask.title.toLowerCase().includes('5 things')) {
                return 'Look around and identify 5 things you can see. This grounds you in the present moment.';
            }
            return activeTask.description || 'Take a quick break to reset.';
        };

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md p-8 text-center space-y-6">
                    <div className="text-6xl">{getTaskIcon()}</div>

                    <h2 className="text-2xl font-bold">{activeTask.title}</h2>

                    <p className="text-white/70">{getTaskInstructions()}</p>

                    <div className="relative w-40 h-40 mx-auto">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                            <circle
                                cx="80" cy="80" r="72" fill="none" stroke="#2dd4bf" strokeWidth="10"
                                strokeDasharray={452}
                                strokeDashoffset={452 - (452 * taskProgress) / 100}
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
                            style={{ width: `${taskProgress}%` }}
                        />
                    </div>

                    <Button
                        onClick={() => {
                            setActiveTask(null);
                            setCompletingTask(null);
                        }}
                        variant="secondary"
                        className="w-full"
                    >
                        Skip
                    </Button>
                </Card>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            {showGame && activeGameTask && (
                <BubbleGame
                    onComplete={onGameComplete}
                    onCancel={() => {
                        setShowGame(false);
                        setActiveGameTask(null);
                        setCompletingTask(null);
                    }}
                />
            )}

            {renderTaskModal()}

            <header className="mb-12 text-center">
                <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-blue-400">
                    Before we look at the full picture...
                </h1>
                <p className="text-white/60">
                    Your initial stress level was high. Let's reset your nervous system first.
                </p>
            </header>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left: Gem Progress */}
                <div className="w-full md:w-1/3 space-y-6">
                    <Card className="p-6 text-center border-teal-500/20 bg-gradient-to-br from-teal-900/20 to-blue-900/20">
                        <h2 className="text-xl font-bold mb-4">Unlock Insight</h2>
                        <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    fill="none"
                                    stroke="#2dd4bf"
                                    strokeWidth="8"
                                    strokeDasharray={377}
                                    strokeDashoffset={377 - (377 * progress) / 100}
                                    className="transition-all duration-500 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold">{displayGems}</span>
                                <span className="text-xs text-white/50">/ {unlockCost}</span>
                            </div>
                        </div>
                        <Button
                            onClick={handleUnlock}
                            disabled={!canUnlock}
                            className={`w-full ${!canUnlock ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
                        >
                            {canUnlock ? 'Unlock Results →' : 'Collect More Gems'}
                        </Button>
                    </Card>
                </div>

                {/* Right: Tasks */}
                <div className="w-full md:w-2/3 grid grid-cols-1 gap-4">
                    {tasks.map((task) => {
                        const isThisTaskActive = completingTask === task._id;
                        const anyTaskActive = completingTask !== null;

                        return (
                            <Card
                                key={task._id}
                                className={`relative overflow-hidden transition-all border-white/5 ${isThisTaskActive
                                        ? 'bg-teal-500/10 border-teal-500/30'
                                        : anyTaskActive
                                            ? 'opacity-50'
                                            : 'hover:bg-white/10'
                                    }`}
                            >
                                <div className="relative flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${isThisTaskActive ? 'bg-teal-500/20 scale-110' : 'bg-white/5'
                                            }`}>
                                            {task.type === 'game' ? '🎮' :
                                                task.type === 'breathing' ? '🌬️' :
                                                    task.type === 'movement' ? '🚶' :
                                                        '⚡'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{task.title}</h3>
                                            <p className="text-sm text-white/50">
                                                {task.duration}s • {task.gemReward} Gems
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="min-w-[100px] px-4 py-2 text-sm"
                                        onClick={() => handleCompleteTask(task)}
                                        disabled={anyTaskActive}
                                    >
                                        {isThisTaskActive ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-pulse">●</span> Active
                                            </span>
                                        ) : (
                                            task.type === 'game' ? 'Play' : 'Start'
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}

                    {tasks.length === 0 && (
                        <div className="text-white/40 text-center py-8">
                            No tasks available. (Seed the database!)
                            <br />
                            <span className="text-xs">Run a seed script to add Tasks.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

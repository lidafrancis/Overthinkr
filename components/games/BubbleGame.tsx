'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    color: string;
    popped: boolean;
}

interface BubbleGameProps {
    onComplete: () => void;
    onCancel?: () => void;
}

export default function BubbleGame({ onComplete, onCancel }: BubbleGameProps) {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const reqRef = useRef<number>(0);

    // Initialize bubbles
    useEffect(() => {
        const initialBubbles: Bubble[] = Array.from({ length: 15 }).map((_, i) => createBubble(i));
        setBubbles(initialBubbles);

        // Timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Game Loop for movement
    useEffect(() => {
        const animate = () => {
            setBubbles((prevBubbles) =>
                prevBubbles.map((b) => {
                    if (b.popped) return b;
                    let newY = b.y - b.speed;
                    // Reset if off screen
                    if (newY < -100) {
                        return createBubble(b.id); // Recycle bubble
                    }
                    return { ...b, y: newY };
                })
            );
            reqRef.current = requestAnimationFrame(animate);
        };

        reqRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(reqRef.current);
    }, []);

    const createBubble = (id: number): Bubble => {
        const colors = [
            'bg-blue-400/60', 'bg-indigo-400/60', 'bg-purple-400/60',
            'bg-pink-400/60', 'bg-cyan-400/60'
        ];
        return {
            id,
            x: Math.random() * 90, // percent
            y: 110 + Math.random() * 50, // Start below screen
            size: 40 + Math.random() * 60, // px
            speed: 0.5 + Math.random() * 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            popped: false,
        };
    };

    const handlePop = (id: number) => {
        setBubbles((prev) => prev.map(b => b.id === id ? { ...b, popped: true } : b));
        setScore(s => s + 1);

        // Play sound effect (optional/stub)
        // const audio = new Audio('/pop.mp3'); audio.play().catch(() => {});

        // Respawn bubble after delay
        setTimeout(() => {
            setBubbles((prev) => prev.map(b => {
                if (b.id === id) return createBubble(id);
                return b;
            }));
        }, 1000);
    };

    const finishGame = () => {
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden">
            {/* Header */}
            <div className="absolute top-6 w-full px-8 flex justify-between items-center z-10">
                <div className="text-white">
                    <div className="text-sm opacity-60">Time Left</div>
                    <div className="text-2xl font-bold font-mono">{timeLeft}s</div>
                </div>
                <div className="text-white text-center">
                    <div className="text-sm opacity-60">Bubbles Popped</div>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        {score}
                    </div>
                </div>
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    className="p-2 rounded-full h-10 w-10 flex items-center justify-center"
                >
                    <X size={20} />
                </Button>
            </div>

            {/* Game Area */}
            <div ref={containerRef} className="relative w-full h-full max-w-4xl">
                {bubbles.map((bubble) => (
                    !bubble.popped && (
                        <div
                            key={bubble.id}
                            onMouseDown={() => handlePop(bubble.id)}
                            onTouchStart={() => handlePop(bubble.id)}
                            className={`absolute rounded-full cursor-pointer backdrop-blur-sm border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-transform hover:scale-110 active:scale-95 flex items-center justify-center ${bubble.color}`}
                            style={{
                                left: `${bubble.x}%`,
                                top: `${bubble.y}%`,
                                width: `${bubble.size}px`,
                                height: `${bubble.size}px`,
                                transition: 'transform 0.1s',
                            }}
                        >
                            <div className="w-1/3 h-1/3 bg-white/20 rounded-full absolute top-2 right-2 blur-[2px]" />
                        </div>
                    )
                ))}
            </div>

            {/* Game Over Modal */}
            {gameOver && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl text-center max-w-sm w-full animate-in fade-in zoom-in duration-300">
                        <h2 className="text-3xl font-bold text-white mb-2">Time's Up!</h2>
                        <p className="text-white/60 mb-6">You popped {score} bubbles of stress.</p>
                        <Button
                            onClick={finishGame}
                            className="w-full py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-600"
                        >
                            Collect Gems 💎
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

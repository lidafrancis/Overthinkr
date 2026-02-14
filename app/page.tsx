import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Overthinkr
        </h1>
        <p className="text-xl md:text-2xl text-white/60 leading-relaxed">
          Turn your spirals into stepping stones. <br />
          Gamified emotional processing for the modern mind.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/login">
            <Button className="w-full sm:w-auto text-lg px-8 py-4">
              Login to Your Space
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/40">
          <div>
            <div className="text-2xl mb-2">🌊</div>
            <h3 className="font-bold text-white/70">Flow</h3>
            <p className="text-sm">Release your thoughts without judgment.</p>
          </div>
          <div>
            <div className="text-2xl mb-2">💎</div>
            <h3 className="font-bold text-white/70">Earn</h3>
            <p className="text-sm">Complete micro-tasks to unlock insights.</p>
          </div>
          <div>
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-bold text-white/70">Review</h3>
            <p className="text-sm">See your emotional shift in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

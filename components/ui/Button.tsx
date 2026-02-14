import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    const baseClass = "relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "text-white shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-purple-600",
        secondary: "text-white/90 bg-white/10 hover:bg-white/15 border border-white/10",
        danger: "text-white bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/20",
        ghost: "text-white/60 hover:text-white bg-transparent hover:bg-white/5",
    };

    return (
        <button
            className={`${baseClass} ${variants[variant]} ${className}`}
            {...props}
        >
            {props.children}
        </button>
    );
}

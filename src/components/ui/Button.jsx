import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

const Button = forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
        primary: 'bg-gradient-to-r from-supnum-blue to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5',
        secondary: 'bg-gradient-to-r from-supnum-gold to-amber-500 text-white hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5',
        outline: 'border-2 border-supnum-blue text-supnum-blue hover:bg-supnum-blue/5',
        ghost: 'hover:bg-slate-100 text-slate-700',
        link: 'text-supnum-blue underline-offset-4 hover:underline',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30',
    };

    const sizes = {
        sm: 'h-9 px-4 text-sm rounded-lg',
        md: 'h-11 px-6 py-2 rounded-xl',
        lg: 'h-12 px-8 text-lg rounded-xl',
        icon: 'h-10 w-10 rounded-xl',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-supnum-blue disabled:pointer-events-none disabled:opacity-50 active:scale-95',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export { Button };

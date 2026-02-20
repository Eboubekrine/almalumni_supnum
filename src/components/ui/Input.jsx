import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

const Input = forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-supnum-blue focus-visible:ring-offset-2 focus-visible:border-supnum-blue/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-white focus:bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:ring-offset-slate-950',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export { Input };

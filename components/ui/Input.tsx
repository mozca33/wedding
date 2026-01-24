import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, icon, type, ...props }, ref) => {
	return (
		<div className="space-y-2">
			{label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
			<div className="relative">
				{icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
				<input
					type={type}
					className={cn('input-field', icon ? 'pl-10' : false, error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : false, className)}
					ref={ref}
					{...props}
				/>
			</div>
			{error && <p className="text-sm text-red-600">{error}</p>}
		</div>
	);
});

Input.displayName = 'Input';

export { Input };

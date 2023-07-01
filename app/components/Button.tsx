"use client"

import clsx from 'clsx'

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset' | undefined;
    fullWidth?: boolean;
    children?: React.ReactNode;
    onClick?:() => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps>= ({type, fullWidth, children, onClick, secondary, danger, disabled}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx('flex justify-center py-2 px-3 shadow-sm text-sm font-semibold rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500', fullWidth && 'w-full', secondary ? 'bg-gray-900  hover:bg-gray-800 focus:ring-gray-500' : 'text-white', danger && 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 focus-visible:outline-rose-600', !secondary && !danger && ' transition ease-in-out delay-150 bg-sky-500 hover:-translate-y-1 hover:scale-110 hover:bg-pink-500 duration-500  focus-visible:outline-sky-600 focus:ring-sky-500', disabled && 'opacity-50 cursor-default')}
        >
            {children}
        </button>
    )
}

export default Button
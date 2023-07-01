"use client"

import clsx from 'clsx'
import { FieldValues, UseFormRegister, FieldErrors } from 'react-hook-form'

interface InputProps {
    label: string;
    id: string;
    type?: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
    required?: boolean;
    disabled?: boolean;


}

const Input: React.FC<InputProps> = ({ label, id, type, required, register, errors, disabled }) => {
    return (
        <div>
            <label htmlFor={id} className='block text-sm font-medium leading-6 text-gray-900'>
                {label}
            </label>
            <div className='mt-2'>
                <input
                    type={type}
                    disabled={disabled}
                    id={id}
                    {...register(id, { required })}
                    autoComplete={id}
                    className={clsx("form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 ", errors[id] && 'ring-2 ring-rose-500', disabled && 'bg-gray-100 opacity-50 cursor-default')}
                />
            </div>
        </div>
    )
}

export default Input
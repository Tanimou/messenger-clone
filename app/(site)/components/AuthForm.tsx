"use client"

import Button from "@/app/components/Button"
import Input from "@/app/components/input/Input"
import { useCallback, useState } from "react"
import { useForm, FieldValues, SubmitHandler, set } from "react-hook-form"
import AuthSocialButton from "./AuthSocialButton"
import {BsGithub,BsGoogle} from 'react-icons/bs'
import axios from "axios"
import { toast } from "react-hot-toast"
import { signIn } from "next-auth/react"

type Variant = 'signin' | 'signup'
const AuthForm = () => {
    const [variant, setVariant] = useState<Variant>('signin')
    const [isLoading, setIsLoading] = useState(false)

    const toggleVariant = useCallback(() => {
        setVariant(variant === 'signin' ? 'signup' : 'signin')
    }, [variant])

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
            name: '',
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        if (variant === 'signup') {
            //NextAuth Sign in
            axios.post('/api/auth/signup', data)
                .catch(() => toast.error('Something went wrong'))
                .finally(() => setIsLoading(false))
        }
        else {
            signIn('credentials', {
                ...data,
                redirect: false
            }).then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid credentials")
                }
                else {
                    toast.success('Signed in successfully')
                }
            }).catch(() => toast.error('Something went wrong'))
                .finally(() => setIsLoading(false))
        }
    
    }

    const socialAction = (action: string) => {
        //NextAuth Social Sign in
        setIsLoading(true)
        signIn(action, {
            redirect: false
        }).then((callback) => {
            if (callback?.error) {
                toast.error("Invalid credentials")
            }
            else {
                toast.success('Signed in successfully')
            }
        }).catch(() => toast.error('Something went wrong'))
            .finally(() => setIsLoading(false))
    }
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {variant === 'signup' && (

                        <Input errors={errors} id="name" register={register} label="Name" disabled={isLoading} />
                    )}
                    <Input errors={errors} id="email" type="email" register={register} label="Email address" disabled={isLoading} />

                    <Input errors={errors} type="password" id="password" register={register} label="Password" disabled={isLoading} />
                    <div>
                        <Button
                            disabled={isLoading}
                            type="submit"
                            fullWidth
                        >{variant === 'signin' ? 'Sign in' : 'Sign up'}</Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>

                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton icon={BsGithub} onClick={()=>socialAction('github')}/>
                        <AuthSocialButton icon={BsGoogle} onClick={()=>socialAction('google')}/>
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>
                        {variant === 'signin' ? "Don't have an account?" : "Already have an account?"}
                    </div>
                    <div onClick={toggleVariant}
                        className="underline cursor-pointer">
                        {variant === 'signin' ? 'Sign up' : 'Sign in'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm
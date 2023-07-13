"use client"

import clsx from 'clsx'
import Link from 'next/link'
import { FC } from 'react'
import { IconType } from 'react-icons'

interface MobileItemProps {
    href: string
    label: string
    icon: IconType
    isActive?: boolean
    onClick?: () => void
}

const MobileItem: FC<MobileItemProps> = ({ label, href, icon: Icon, isActive, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick()
        }
    }
    return (
        <Link href={href} onClick={handleClick} className={clsx("group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100",isActive &&"bg-gray-100 text-black")}>
            <Icon className='h-6 w-6'/>
        </Link>
    )
}

export default MobileItem
"use client"

import React,{FC} from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { IconType } from 'react-icons'

interface DesktopItemProps {
  href: string
  label: string
  icon: IconType
  isActive?: boolean
  onClick?: () => void
}

const DesktopItem: FC<DesktopItemProps> = ({ label, href, icon:Icon, isActive, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }
  return (
    <li onClick={handleClick}>
      <Link href={href} className={clsx("group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100 ",isActive && "bg-gray-100 text-black")}>
        <Icon className="h-6 w-6 shrink-0"/>
        <span className='sr-only'>{label}</span>
      </Link>
    </li>
  )
}

export default DesktopItem
"use client"

import useOtherUser from '@/app/hooks/useOtherUser'
import { Conversation, User } from '@prisma/client'
import { FC, useMemo, useState } from 'react'
import Link  from 'next/link';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import Avatar from '@/app/components/Avatar';
import ProfileDrawer from './ProfileDrawer';
import AvatarGroup from '@/app/components/AvatarGroup';

interface HeaderProps {
    conversation: Conversation & {
        users: User[]
    }
}

const Header: FC<HeaderProps> = ({ conversation }) => {
    const otherUser = useOtherUser(conversation)
    const [drawOpen, setDrawOpen] = useState(false)
    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`
        }
        return 'Active'
    }, [conversation])
    return (
        <>
            <ProfileDrawer data={conversation} isOpen={drawOpen} onClose={()=>setDrawOpen(false)} />
            <div className='bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
                <div className='flex gap-3 items-center'>
                    <Link href="/conversations" className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer">
                        <HiChevronLeft size={32} />
                    </Link>
                    {conversation.isGroup ? (
                        <AvatarGroup users={conversation.users} />
                    ) : (
                        <Avatar user={otherUser} />
                    )}
                    
                    <div className='flex flex-col'>
                        <div>
                            {otherUser.name || conversation.name}
                        </div>
                        <div className='text-sm font-light text-neutral-500'>
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal size={32} onClick={() => setDrawOpen(true)} className='text-sky-500 cursor-pointer hover:text-sky-600 transition' />
            </div>
        </>
    
    )
}

export default Header

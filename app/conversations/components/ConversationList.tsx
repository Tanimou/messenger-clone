"use client"

import useConversation from '@/app/hooks/useConversation'
import { FullConversationType } from '@/app/types'
import clsx from 'clsx'
import { MdOutlineGroupAdd } from 'react-icons/md'


import { FC, useEffect, useMemo, useState } from 'react'
import ConversationBox from './ConversationBox'
import GroupChatModal from './GroupChatModal'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/app/libs/pusher'
import { find } from 'lodash'
import { useRouter } from 'next/navigation'

interface ConversationListProps {
    initialItems: FullConversationType[]
    users:User[]
}

const ConversationList: FC<ConversationListProps> = ({ initialItems, users }) => {
    const session = useSession()
    const router = useRouter();
    const [items, setItems] = useState(initialItems)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { conversationId, isOpen } = useConversation()

    const pusherKey = useMemo(() => {
        return session.data?.user?.email
    }, [session.data?.user?.email])
    
    // const handleClick = (id: string) => {
    //     router.push(`/conversations/${id}`)
    // }


        useEffect(() => {
            if (!pusherKey) {
                return
            }
            pusherClient.subscribe(pusherKey)

            const newHandler = (conversation: FullConversationType) => {
                setItems((prev) => {
                    if (find(prev, { id: conversation.id })) {
                        return prev
                    }
                    return [conversation, ...prev]
                })
            }

            const updateHandler = (conversation: FullConversationType) => {
                setItems((prev) => prev.map((currentConversation) => {
                    if (currentConversation.id === conversation.id) {
                        return {
                            ...currentConversation,
                            messages: conversation.messages
                        }
                    }
                    return currentConversation
                }))
            }

            const deleteHandler = (conversation: FullConversationType) => {
                setItems((prev) => [...prev.filter((currentConversation) => currentConversation.id !== conversation.id)])

                if(conversationId === conversation.id){
                    router.push('/conversations')
                }
            }


            pusherClient.bind('conversation:new', newHandler)
            pusherClient.bind('conversation:update', updateHandler)
            pusherClient.bind('conversation:delete', deleteHandler)

            return () => {
                pusherClient.unsubscribe(pusherKey)
                pusherClient.unbind('conversation:new', newHandler)
                pusherClient.unbind('conversation:update', updateHandler)
                pusherClient.unbind('conversation:delete', deleteHandler)


            }
        }, [pusherKey,conversationId,router])
    

    return (
        <>
            <GroupChatModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} users={users} />
            <aside className={clsx(`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 `, isOpen ? 'hidden' : 'block w-full left-0')}>
                <div className='px-5'>
                    <div className='flex justify-between mb-4 pt-4'>
                        <div className='text-2xl font-bold text-neutral-800'>
                            Messages
                        </div>
                        <div className='rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition' onClick={() => setIsModalOpen(true)}>
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {items.map((item) => (
                        <ConversationBox key={item.id} data={item} selected={conversationId === item.id}/>
                    ))}
                </div>
            </aside>
        </>
    )
}

export default ConversationList
"use client"

import { FullConversationType, FullMessageType } from '@/app/types'
import { FC, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Conversation, Message, User } from '@prisma/client'
import { format } from 'date-fns'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import useOtherUser from '@/app/hooks/useOtherUser'
import Avatar from '@/app/components/Avatar'
import AvatarGroup from '@/app/components/AvatarGroup'

interface ConversationBoxProps {
    data: FullConversationType
    selected?: boolean
    

}

const ConversationBox: FC<ConversationBoxProps> = ({ data, selected }) => {
    const otherUser = useOtherUser(data)
    const router = useRouter()
    const session = useSession()
    const isMe = session?.data?.user?.email === (data.messages.length > 0 ? data.messages[data.messages.length - 1].sender?.email : undefined);

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [data, router])

    const lastMessage = useMemo(() => {
        const lastMessage = data.messages[data.messages?.length - 1]
        if (!lastMessage) {
            return null
        }
        return lastMessage
    }, [data.messages])

    const userEmail = useMemo(() => {
        if (!session.data) {
            return null
        }
        return session.data?.user?.email
    }, [session.data?.user?.email])

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false
        }
        if (!userEmail) {
            return false
        }
        const seenArray = lastMessage.seenByUsers || []
        return seenArray.filter((user) => user.email === userEmail).length !== 0
    }, [lastMessage, userEmail])

    const lastMessageText = useMemo(() => {
    
        
        if (lastMessage?.image) {
            return 'Sent an image'
        }
        if (lastMessage?.text) {
            return lastMessage.text
        }

        return "started a conversation"
        
    }, [lastMessage])
    return (
        <div
            onClick={handleClick}
            className={clsx(`w-full relative flex items-center space-x-3 p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer`,selected ? 'bg-neutral-100' : 'bg-white')}
        >
            {data.isGroup ? (
                <AvatarGroup users={data.users} />
                // <Avatar user={otherUser} />
            ) : (
                <Avatar user={otherUser} />
            )}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-md font-medium text-gray-900">
                            {data.name || otherUser.name}
                        </p>
                        {lastMessage?.createdAt && (
                            <p className="text-xs text-gray-400 font-light">
                                {format(new Date(lastMessage.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    {isMe ? (
                        <p className={clsx(`truncate text-sm`, hasSeen ? 'text-gray-500' : 'text-black font-medium')}>
                            You: {lastMessageText}
                        </p>
                    ) : (
                        <p className={clsx(`truncate text-sm`, hasSeen ? 'text-gray-500' : 'text-black font-medium')}>
                            {lastMessageText}
                        </p>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

export default ConversationBox
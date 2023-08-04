"use client"

import { User } from '@prisma/client'
import { FC } from 'react'

interface GroupChatModalProps {
    isOpen?: boolean
    onClose: () => void
    users:User[]
}

const GroupChatModal: FC<GroupChatModalProps> = ({isOpen,onClose,users}) => {
  return (<div>GroupChatModal</div>)
}

export default GroupChatModal
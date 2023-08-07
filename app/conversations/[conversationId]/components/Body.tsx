"use client"

import { FC, useEffect, useRef, useState } from 'react'
import { FullMessageType } from '@/app/types'
import useConversation from '@/app/hooks/useConversation'
import MessageBox from './MessageBox'
import axios from 'axios'
import { pusherClient } from '@/app/libs/pusher'
import { find } from 'lodash'

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { conversationId } = useConversation()
  
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)

      setMessages((prev) => {
        if(find(prev,{id:message.id})){
          return prev
        }
        return [...prev, message]
      })
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((prev) => prev.map((currentMessage) => { 
          if(currentMessage.id === newMessage.id){
            return newMessage
        }
        return currentMessage
      }))
    }


    pusherClient.bind('messages:new',messageHandler)
    pusherClient.bind('message:update',updateMessageHandler)
    
    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new',messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId])
  
  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message, i) => (
        <MessageBox islast={i === messages.length-1} key={message.id} data={message} />
      ))}
              <div ref={bottomRef} className='pt-24'/>
            </div>
  )
}

export default Body
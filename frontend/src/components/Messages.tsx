import Message from "./Message"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useChannel } from "../providers/ChatChannelProvider"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import chatService from "../services/chatService"
import { useSocket } from "../providers/SocketProvider"
import { useEffect, useRef } from "react"
type message = {
  content: String
  post_date: Date
  _id: String
  owner_username: String | undefined
}

interface ChatInterface {
  owner_username: String
  messages: [message]
}

const MergeOnDate = (chats: ChatInterface[]): message[] => {
  const mergedMessages: message[] = []
  chats.forEach((chat: ChatInterface) => {
    chat.messages.forEach((msg: message) => {
      msg.owner_username = chat.owner_username
    })
    mergedMessages.push(...chat.messages)
  })

  mergedMessages.sort((m1: message, m2: message) => {
    return new Date(m1.post_date).getTime() - new Date(m2.post_date).getTime()
  })

  return mergedMessages
}

const Messages = () => {
  const { currentChannel } = useChannel()
  const { getToken } = useAuth()
  const { user } = useUser()
  const { socket } = useSocket()
  const client = useQueryClient()
  const lastMsgRef = useRef<HTMLElement>()
  const {
    data: messages,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["chat", currentChannel],
    queryFn: async () => {
      const data = await chatService.getChat(currentChannel!.id, getToken)
      return MergeOnDate(data.chat as ChatInterface[])
    },

    enabled: !!currentChannel, //only executes when currentChannel is defined

    onError: (e: any) => {
      console.log(e)
    },
  })

  useEffect(() => {
    if (!socket) return

    socket.on("message-sent", message => {
      client.refetchQueries(["chat"])
    })

    return () => {
      socket.off("message-sent")
    }
  }, [socket, client])

  useEffect(() => {
    lastMsgRef.current?.scrollIntoView()
  }, [messages])

  if (isError) return <></>

  if (isLoading) return <></>

  return (
    <>
      {messages.map((msg, index) => (
        <Message
          ref={index === messages.length - 1 ? lastMsgRef : undefined}
          key={msg._id as React.Key}
          message={msg.content as string}
          ownerType={
            msg.owner_username === user?.username ? "sender" : "receiver"
          }
        />
      ))}
    </>
  )
}

export default Messages

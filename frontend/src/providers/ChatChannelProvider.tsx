import { PropsWithChildren, createContext, useContext, useState } from "react";

export interface Channel {
  id: string
  users: [string]
}

interface ChatChannel {
  currentChannel?: Channel
  setCurrentChannel: (newChannel: Channel) => void 
}

const ChatChannelContext = createContext<ChatChannel>({
  currentChannel: undefined,
  setCurrentChannel: () => {}
})

export const useChannel = () => useContext(ChatChannelContext)

export const ChatChannelContextProvider = ({ children }: PropsWithChildren) => {
  const [currentChannel, setCurrentChannel] = useState<Channel>()

  return (
    <ChatChannelContext.Provider value={{ currentChannel, setCurrentChannel }}>
      {children}
    </ChatChannelContext.Provider>
  )
}
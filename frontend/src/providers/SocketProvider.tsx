import { createContext, useContext, useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"
import { useAuth } from "@clerk/clerk-react"
interface SocketContextObject {
  setSocketChannel: any | null
  socket: Socket | null
}

const SocketContext = createContext<SocketContextObject>({
  setSocketChannel: null,
  socket: null,
})

export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }: any) => {
  const [socketChannel, setSocketChannel] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)
  const { getToken } = useAuth()

  useEffect(() => {
    if (!socketChannel) return

    const handleSocket = async () => {
      const socket = io(process.env.REACT_APP_BACKEND_URL || '/', {
        auth: {
          token: `Bearer ${await getToken()}`,
        },
        query: {
          socketChannel,
        },
      })

      socket.emit("join-channel", { channel: socketChannel })
      socket.on("connect_error", (err: Error) => {
        console.log(err); // not authorized
      });

      setSocket(socket)
    }

    handleSocket()

    return () => {
      //called when another socket is assigned (another channel)
      socket?.off("message-sent")
      socket?.close()
      setSocket(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketChannel])

  return (
    <SocketContext.Provider value={{ setSocketChannel, socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider

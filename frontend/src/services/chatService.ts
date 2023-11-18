import axios from "axios"
import { GetToken } from "@clerk/types"

const baseUrl = `${process.env.REACT_APP_BACKEND_URL || ''}/api/chats`

const getChat = async (channelId: String, getToken: GetToken) => {
  const res = await axios.get(`${baseUrl}/${channelId}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  return res.data
}


const sendMessage = async (message_content: String, channelId: String, getToken: GetToken) => {
  const res = await axios.post(`${baseUrl}/message/${channelId}`, { message_content }, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  return res.data
}

const chatService = {
  getChat,
  sendMessage
}

export default chatService

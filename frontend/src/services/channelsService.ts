import axios from "axios"
import { Channel } from "../providers/ChatChannelProvider"

const baseUrl = `${process.env.REACT_APP_BACKEND_URL || ''}/api/channels`

const createChannel = async (users: any[], getToken: any): Promise<Channel> => {
  const res = await axios.post(`${baseUrl}/create`, { channelUsersClerkIds: users } ,{
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  const channel: Channel = res.data.channel 
  return channel
}

const channelsService = {
    createChannel
}

export default channelsService
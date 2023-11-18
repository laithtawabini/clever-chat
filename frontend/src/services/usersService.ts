import { GetToken } from "@clerk/types"
import axios from "axios"

const baseUrl = `${process.env.REACT_APP_BACKEND_URL || ''}/api/users`

const getFriends = async (getToken: GetToken) => {
  const res = await axios.get(`${baseUrl}/friends`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })
  return res.data
}

const getNonFriends = async (getToken: GetToken) => {
  const res = await axios.get(`${baseUrl}/non-friends`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  return res.data
}

const sendFriendRequestTo = async (addedUserId: string, getToken: GetToken) => {
  const res = await axios.post(
    `${baseUrl}/request/${addedUserId}`,
    {},
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }
  )
  return res.data
}

const declineFriendRequestFrom = async (
  addedUserId: string,
  getToken: GetToken
) => {
  const res = await axios.post(
    `${baseUrl}/decline/${addedUserId}`,
    {},
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }
  )
  return res.data
}

const acceptFriendRequestFrom = async (
  addedUserId: string,
  getToken: GetToken
) => {
  const res = await axios.post(
    `${baseUrl}/accept/${addedUserId}`,
    {},
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }
  )
  return res.data
}

const removeFriend = async (removedUserId: string, getToken: GetToken) => {
  const res = await axios.post(
    `${baseUrl}/remove/${removedUserId}`,
    {},
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }
  )
  return res.data
}

const getRequestedFriends = async (getToken: GetToken) => {
  const res = await axios.get(`${baseUrl}/requested`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })
  return res.data
}

const getFriendRequests = async (getToken: GetToken) => {
  const res = await axios.get(`${baseUrl}/requests`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })
  return res.data
}

const usersService = {
  sendFriendRequestTo,
  declineFriendRequestFrom,
  acceptFriendRequestFrom,
  removeFriend,
  getFriends,
  getNonFriends,
  getRequestedFriends,
  getFriendRequests,
}
export default usersService

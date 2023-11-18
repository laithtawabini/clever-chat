import { Tooltip, IconButton, Popover } from "@mui/material"
import { useState } from "react"
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ListItem from "@mui/material/MenuItem"
import MessageIcon from "@mui/icons-material/Message"
import MenuList from "@mui/material/MenuList"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import usersService from "../../services/usersService"
import { useAuth } from "@clerk/clerk-react"
import { useSnackbar } from "../../providers/SnackbarProvider"
import channelsService from "../../services/channelsService"
import { useChannel } from "../../providers/ChatChannelProvider"
import { useSocket } from "../../providers/SocketProvider"

const FriendOperationsMenu = ({ friend }: any) => {
  const [displaySettings, setDisplaySettings] = useState<any>(null)
  const client = useQueryClient()
  const { getToken, userId } = useAuth()
  const { setSnackbar } = useSnackbar()
  const { setCurrentChannel, currentChannel } = useChannel()
  const { socket, setSocketChannel } = useSocket()
  const removeFriendMutation = useMutation({
    mutationKey: ["removeFriend"],
    mutationFn: (id: string) => usersService.removeFriend(id, getToken),
    onSuccess: async (data, id) => {
      client.setQueryData(["friends"], (input: any) => {
        return {
          friends: input.friends.filter(
            (friend: any) => friend.clerk_userId !== id
          ),
        }
      })

      await client.invalidateQueries(["nonFriends"])

      setSnackbar({
        message: "Successfully removed",
        severity: "success",
      })
    },
    onError: (err: any) => {
      setSnackbar({ message: err, severity: "error" })
    },
  })

  const createChatChannelMutation = useMutation({
    mutationKey: ["createChannel"],
    mutationFn: (channelUsers: any[]) => channelsService.createChannel(channelUsers, getToken),
    onSuccess: async channel => {
      if(currentChannel) {
        if(currentChannel.id === channel.id)
          return
      }

      setCurrentChannel({
        id: channel.id,
        users: channel.users,
      })

      setSocketChannel(channel.id)

      socket?.on("message-sent", message => {
        client.refetchQueries(["chat"])
      })
    },
    onError: (err: any) => {
      setSnackbar({ message: err.response.data.message, severity: "error" })
    },
  })

  const handleRemoveFriend = async (id: string) => {
    await removeFriendMutation.mutateAsync(id)
    client.invalidateQueries(["nonFriends", "friends"])
    setDisplaySettings(null)
  }

  const handleStartChat = () => {
    createChatChannelMutation.mutate([friend.clerk_userId, userId])
  }

  return (
    <>
      <Tooltip
        title="Operations"
        placement="right"
        sx={{ justifySelf: "flex-start" }}
      >
        <IconButton
          size="small"
          onClick={e => setDisplaySettings(e.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(displaySettings)}
        anchorEl={displaySettings}
        onClose={() => setDisplaySettings(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuList
          sx={{ display: "flex", flexDirection: "column", padding: "5px" }}
        >
          <ListItem onClick={() => handleStartChat()}>
            <ListItemIcon>
              <MessageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Message</ListItemText>
          </ListItem>
          <ListItem onClick={() => handleRemoveFriend(friend.clerk_userId)}>
            <ListItemIcon>
              <PersonRemoveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remove friend</ListItemText>
          </ListItem>
        </MenuList>
      </Popover>
    </>
  )
}

export default FriendOperationsMenu

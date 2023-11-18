import {
  Avatar,
  IconButton,
  ListItem,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import usersService from "../../services/usersService"
import { useAuth } from "@clerk/clerk-react"
import { Player } from "@lottiefiles/react-lottie-player"
import StyledList from "../../styled_components/styledList"
import DoneIcon from "@mui/icons-material/Done"
import { useSnackbar } from "../../providers/SnackbarProvider"

const FriendRequestsList = () => {
  const { getToken } = useAuth()
  const client = useQueryClient()
  const { setSnackbar } = useSnackbar()

  const { data, isError, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: () => usersService.getFriendRequests(getToken),
  })

  const acceptFriendMutation = useMutation({
    mutationKey: ["acceptFriendRequest"],
    mutationFn: (id: string) =>
      usersService.acceptFriendRequestFrom(id, getToken),
    onSuccess: async (data, addedUserId) => {
      client.setQueryData(["friendRequests"], (input: any) => {
        return {
          friend_requests: input.friend_requests.filter(
            (friend: any) => friend.clerk_userId !== addedUserId
          ),
        }
      })
      await client.invalidateQueries(["friends"])
      setSnackbar({ message: "Successfully accepted", severity: "success" })
    },
  })

  if (isLoading)
    return (
      <Player
        autoplay
        loop
        style={{ width: "100px" }}
        src={
          "https://lottie.host/24d8263e-93e8-4580-b6e5-75d082ddbcbf/xRaf2SujX8.json"
        }
      />
    )

  if (isError) return <>Failed to fetch friends.</>

  const handleAcceptFriend = (addedUserId: string) => {
    acceptFriendMutation.mutate(addedUserId)
  }
  const friend_requests: any[] = data.friend_requests || []

  return (
    <>
      <StyledList>
        {friend_requests.map(friend => (
          <ListItem key={friend.clerk_userId} sx={{ padding: "0px" }}>
            <Paper
              sx={{
                margin: "0px",
                display: "flex",
                width: "95%",
                padding: "5px",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Avatar alt="profile image" src={friend.image_url} />
              <Typography>{friend.username}</Typography>
              <Tooltip
                title="Accept"
                placement="right"
                sx={{ justifySelf: "end" }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleAcceptFriend(friend.clerk_userId)}
                >
                  <DoneIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          </ListItem>
        ))}
      </StyledList>
    </>
  )
}

export default FriendRequestsList

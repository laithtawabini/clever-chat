import { Avatar, ListItem, Paper, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import usersService from "../../services/usersService"
import { useAuth } from "@clerk/clerk-react"
import { Player } from "@lottiefiles/react-lottie-player"
import StyledList from "../../styled_components/styledList"

const RequestedFriendsList = () => {
  const { getToken } = useAuth()

  const { data, isError, isLoading } = useQuery({
    queryKey: ["requestedFriends"],
    queryFn: () => usersService.getRequestedFriends(getToken),
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

  const requested_friends: any[] = data.requested_friends
  return (
    <>
      <StyledList>
        {requested_friends.map(friend => (
          <ListItem
            key={friend.clerk_userId}
            sx={{ padding: "0px", marginBottom: "10px" }}
          >
            <Paper
              sx={{
                margin: "0px",
                display: "flex",
                width: "95%",
                padding: "5px",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Avatar alt="profile image" src={friend.image_url} />
              <Typography>{friend.username}</Typography>
            </Paper>
          </ListItem>
        ))}
      </StyledList>
    </>
  )
}

export default RequestedFriendsList

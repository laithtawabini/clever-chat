import { useAuth } from "@clerk/clerk-react"
import styled from "@emotion/styled"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Collapse,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material"
import { TransitionGroup } from "react-transition-group"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import usersService from "../../services/usersService"
import { Player } from "@lottiefiles/react-lottie-player"
import loadingBlue from "../../animations/loadingBlue.json"
import addAnimation from "../../animations/addAnimation.json"
import { useSnackbar } from "../../providers/SnackbarProvider"

const StyledAccordion = styled(Accordion)({
  borderRadius: 5,
  border: "2px solid grey",
  zIndex: 4,
  position: "absolute",
  bottom: 0,
  width: "100%",
  flex: 1,
  flexShrink: 3,
})

const UsersList = () => {
  const client = useQueryClient()
  const { setSnackbar } = useSnackbar()
  const { getToken } = useAuth()

  const { data, isError } = useQuery({
    queryKey: ["nonFriends"],
    queryFn: () => usersService.getNonFriends(getToken),
  })

  const addFriendMutation = useMutation({
    mutationFn: (targetUserId: string) =>
      usersService.sendFriendRequestTo(targetUserId, getToken),
    onSuccess: async (data, addedId) => {
      client.setQueryData(["nonFriends"], (input: any) => {
        return {
          nonFriends: input.nonFriends.filter(
            (friend: any) => friend.clerk_userId !== addedId
          ),
        }
      })

      await client.invalidateQueries(["requestedFriends"])

      setSnackbar({ message: "Successfully requested", severity: "success" })
    },
    onError: (err: any) => {
      setSnackbar({ message: err.response.data.message, severity: "error" })
    },
  })

  const handleAddFriend = (addedFriend: any) => {
    addFriendMutation.mutate(addedFriend.clerk_userId)
  }

  if (isError) return <>Failed to view users.</>

  const nonFriends = data ? data.nonFriends : null
  return (
    <>
      <StyledAccordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Add Friends</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: "0px" }}>
          {nonFriends ? (
            nonFriends.length > 0 ? (
              <List>
                <TransitionGroup>
                  {nonFriends.map((user: any) => (
                    <Collapse key={user.clerk_userId}>
                      <ListItem>
                        <Paper
                          sx={{
                            margin: "0px",
                            display: "flex",
                            width: "100%",
                            padding: "5px",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Avatar alt="profile image" src={user.image_url} />
                          <Typography>{user.username}</Typography>
                          <span
                            style={{
                              width: "30px",
                              cursor: "pointer",
                              justifySelf: "end",
                            }}
                            onClick={() => handleAddFriend(user)}
                          >
                            <Player hover src={addAnimation} />
                          </span>
                        </Paper>
                      </ListItem>
                    </Collapse>
                  ))}
                </TransitionGroup>
              </List>
            ) : (
              <Typography
                padding={"10px"}
                textAlign={"center"}
                fontSize={"small"}
              >
                No users available
              </Typography>
            )
          ) : (
            <Player
              autoplay
              loop
              style={{ width: "100px" }}
              src={loadingBlue}
            />
          )}
        </AccordionDetails>
      </StyledAccordion>
    </>
  )
}

export default UsersList

import { Avatar, InputBase, ListItem, Paper, Typography } from "@mui/material"
import { Box, Stack, styled } from "@mui/system"
import SearchIcon from "@mui/icons-material/Search"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import usersService from "../../services/usersService"
import { useAuth } from "@clerk/clerk-react"
import { Player } from "@lottiefiles/react-lottie-player"
import StyledList from "../../styled_components/styledList"
import FriendOperationsMenu from "./FriendOperationsMenu"

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxHeight: "90%",
  gap: "5px",
})

const SearchBox = styled(Box)({
  display: "flex",
  alignSelf: "start",
  paddingLeft: "5px",
  paddingRight: "5px",
  columnGap: "5px",
  borderBottom: "1px solid grey",
  width: "95%",
})

const FriendsList = () => {
  const [searchInput, setSearchInput] = useState<string>("") //could be useRef

  const { getToken } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["friends"],
    queryFn: () => usersService.getFriends(getToken),
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

  const friends: any[] = data.friends

  return (
    <>
      <StyledBox>
        <SearchBox>
          <SearchIcon color="primary" />
          <InputBase
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </SearchBox>
        <StyledList>
          {friends &&
            friends
              .filter(f =>
                searchInput ? f.username.includes(searchInput) : true
              )
              .map(friend => (
                <ListItem
                  key={friend.clerk_userId}
                  sx={{ padding: "0px", marginBottom: "10px", width: "100%" }}
                >
                  <Paper
                    sx={{
                      margin: "0px",
                      display: "flex",
                      direction: "row",
                      width: "95%",
                      // alignItems: "center",
                      // justifyItems: "space-between",
                      padding: "5px",
                      // gap: "10px",
                    }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={"10px"}
                      width={'100%'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <Avatar alt="profile image" src={friend.image_url} />
                        <Typography justifySelf={"start"} sx={{ flex: 2 }}>
                          {friend.username}
                        </Typography>
                      </div>
                      <FriendOperationsMenu friend={friend} />
                    </Stack>
                  </Paper>
                </ListItem>
              ))}
        </StyledList>
      </StyledBox>
    </>
  )
}

export default FriendsList

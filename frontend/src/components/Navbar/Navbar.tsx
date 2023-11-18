import styled from "@emotion/styled"
import { Divider, Tab, Tabs } from "@mui/material"
import { Stack } from "@mui/system"
import FriendsList from "./FriendsList"
import UserProfile from "./UserProfile"
import UsersList from "./UsersList"
import RequestedFriendsList from "./RequestedFriendsList"
import FriendRequestsList from "./FriendRequestsList"
import { useState } from "react"

const StyledTab = styled(Tab)({
  fontSize: "0.8em",
})

const Navbar = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (e: any, newValue: number) => setSelectedTab(newValue)

  return (
    <>
      <Stack spacing={2} direction={"column"} height={"100%"} position={'relative'} width={
        '100%'
      }>
        <div style={{ flex: 1, maxHeight: "150px" }}>
          <UserProfile />
        </div>
        <Divider />
        <Tabs
          sx={{
            marginBottom: "15px",
            
          }}
          allowScrollButtonsMobile
          
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="Friends" />
          <StyledTab label="Received" />
          <StyledTab label="Sent" />
        </Tabs>
        {selectedTab === 0 && <FriendsList />}
        {selectedTab === 1 && <FriendRequestsList />}
        {selectedTab === 2 && <RequestedFriendsList />}
        <UsersList />
      </Stack>
    </>
  )
}

export default Navbar

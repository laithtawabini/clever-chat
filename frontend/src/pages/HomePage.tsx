import { Divider, styled } from "@mui/material"
import { Box } from "@mui/system"
import Navbar from "../components/Navbar/Navbar"
import ChatBox from "../components/ChatBox"
import { ChatChannelContextProvider } from "../providers/ChatChannelProvider"
import SmallScreenNavbarDrawer from "../components/SmallScreenNavbarDrawer"
//wraps everything
const MainFrame = styled(Box)({
  display: "flex",
  height: "100vh",
  alignContent: "center",
  justifyContent: "center",
  alignItems: "center",
   backgroundImage: `url('./app_background.png')`,
  backgroundSize: "cover",
})

//where everything is happening
const AppBox = styled(Box)({
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "lightsteelblue",
  borderRadius: "10px",
  boxShadow: "0px 0px 10px white",
  padding: "20px",
  overflow: "hidden",
  flexFlow: "row",
  opacity: "0.94",
  position: "relative",
})

//Box wrapping the whole chat including input and chat
const StyledChatBox = styled(Box)({
  width: "100%",
  height: "100%",
  minWidth: "auto",
  flex: 4,
  alignSelf: "center",
  display: "flex",
  flexDirection: "column",
})
const StyledNavbarBox = styled(Box)({
  alignSelf: "start",
  height: "100%",
  position: "relative",
  flex: 1,
})
const HomePage = () => {
  return (
    <MainFrame>
      <AppBox
        sx={{
          width: { xs: "100%", sm: "70%" },
          height: { xs: "100%", sm: "80%" },
        }}
      >
        <ChatChannelContextProvider>
          <StyledNavbarBox
            sx={{
              display: { xs: "none", lg: "block" }
            }}
            id="sss"
          >
            <Navbar />
          </StyledNavbarBox>

          <SmallScreenNavbarDrawer  />

          <Divider
            orientation="vertical"
            sx={{ margin: "10px", display: { xs: "none", lg: "block" } }}
          />
          <StyledChatBox>
            <ChatBox />
          </StyledChatBox>
        </ChatChannelContextProvider>
      </AppBox>
    </MainFrame>
  )
}

export default HomePage

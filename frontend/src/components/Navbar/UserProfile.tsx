import { useUser, useAuth } from "@clerk/clerk-react"
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Badge,
} from "@mui/material"
import { Stack, Box } from "@mui/system"
import { Link } from "react-router-dom"
import NotificationsIcon from "@mui/icons-material/Notifications"

const UserProfile = () => {
  const { user } = useUser()
  const { signOut } = useAuth()

  return (
    <>
      <Card
        className="user-profile"
        elevation={1}
        sx={{ backgroundColor: "whitesmoke", height: "100%", minHeight: '130px', overflow: 'hidden', width: '100%' }}
      >
        <CardContent>
          <Box display={"flex"} flexDirection={"row"}>
            <Avatar
              src={user?.imageUrl}
              sx={{ width: 45, height: 45, margin: 2, marginLeft: 0 }}
            />
            <Stack sx={{ margin: 2, marginLeft: 0 }}>
              <Typography fontSize={"0.8rem"} variant="subtitle1">
                {user?.username}
              </Typography>
              <Typography
                fontSize={"0.6rem"}
                color={"GrayText"}
                variant="caption"
              >
                {user?.primaryEmailAddress?.emailAddress}
              </Typography>
            </Stack>
          </Box>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Link onClick={() => signOut()} to={"#"} style={{ textDecoration: 'none'}}>
              Sign Out
            </Link>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon color="disabled" />
              </Badge>
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}

export default UserProfile

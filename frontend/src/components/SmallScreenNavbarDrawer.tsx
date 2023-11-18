import { IconButton, ClickAwayListener, Tooltip } from "@mui/material"
import { Box } from "@mui/system"
import Navbar from "../components/Navbar/Navbar"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import { useState } from "react"

const SmallScreenNavbarDrawer = () => {
  const [openDrawer, setOpenDrawer] = useState(false)

  return (
    <>
      <Box
        id="asd"
        sx={{
          display: { xs: "flex", lg: "none" },
          position: "absolute",
          left: "0",
          height: "100%",
          width: { xs: openDrawer ? "100vw" : '0px', sm: openDrawer ? "100%" : '0px', },
        }}
      >
        <ClickAwayListener onClickAway={() => setOpenDrawer(false)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "100%",
              width: { xs: "100vw", sm: "fit-content" },
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: openDrawer ? "flex" : "none",
                flex: 1,
                height: "100%",
                width: "100%",
                padding: "20px",
                backgroundColor: "lightsteelblue",
                borderRight: "1px solid lightgrey",
              }}
            >
              <Navbar />
              <IconButton
                onClick={() => setOpenDrawer(!openDrawer)}
                sx={{
                  height: "20px",
                  width: "20px",
                  display: { sx: 'block', sm: 'none'},
                  position: 'absolute',
                  right: '0',
                  top: 'calc(50% - 20px)',
                  paddingRight: '10px'
                }}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
            </Box>
            {!openDrawer && (
              <Tooltip title={"friends"}>
                <IconButton
                  onClick={() => setOpenDrawer(!openDrawer)}
                  sx={{ height: "20px", width: "20px" }}
                >
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  )
}

export default SmallScreenNavbarDrawer

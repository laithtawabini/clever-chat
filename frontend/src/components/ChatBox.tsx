import { IconButton, InputBase, Typography } from "@mui/material"
import { Box, Stack, styled } from "@mui/system"
import SendIcon from "@mui/icons-material/Send"
import { useState } from "react"
import SentimentSatisfiedTwoToneIcon from "@mui/icons-material/SentimentSatisfiedTwoTone"
import Picker from "@emoji-mart/react"
import Data from "@emoji-mart/data"
import Messages from "./Messages"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useChannel } from "../providers/ChatChannelProvider"
import chatService from "../services/chatService"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useSocket } from "../providers/SocketProvider"
import customScrollbar from "../utils/custom_scrollbar"



const MessagesBox = styled(Box)({
  // Component Styles
  width: "100%",
  height: "100%",
  backgroundColor: "white",
  padding: "10px",
  overflowY: "scroll",
  margin: "15px",
  marginLeft: "0",
  marginTop: "0",
  borderRadius: "10px",

  // Children Styles
  display: "flex",
  flexDirection: "column",
  gap: "10px",

  ...customScrollbar,
  WebkitOverflowScrolling: 'touch'
})

//the message input only
const MessageInput = styled(Box)({
  border: "1px solid rgba(0, 0, 0, 0.30)",
  padding: "3px",
  borderRadius: "5px",
})

const ChatBox = () => {
  const [chatBoxMsg, setChatBoxMsg] = useState<string>("")
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const { currentChannel } = useChannel()
  const { getToken } = useAuth()
  const client = useQueryClient()
  const { socket } = useSocket()
  const { user } = useUser()

  const sendMsgMutation = useMutation({
    mutationKey: ["send_message"],

    mutationFn: (msg: String) => {
      return chatService.sendMessage(msg, currentChannel!.id, getToken)
    },

    onSuccess: (data: any, message) => {
      client.setQueryData(["chat", currentChannel], (oldChat: any) => {
        return oldChat.concat({
          ...data.message,
          owner_username: user?.username,
        })
      })
      socket?.emit("send-message", { channel: currentChannel?.id, message })
    },
  })

  const onMessageSend = (e: any) => {
    e.preventDefault()

    const message = chatBoxMsg

    if (message === "" || !currentChannel) return

    sendMsgMutation.mutate(message)
    setChatBoxMsg("")
  }

  return (
    <>
      {currentChannel && (
        <Box
          sx={{
            margin: "5px",
          }}
        >
          <Typography>
            Current channel users:{" "}
            {currentChannel?.users.map((user: any) => user.username).join(", ")}
          </Typography>
        </Box>
      )}

      <MessagesBox>
        {currentChannel ? (
          <Messages />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignSelf: "center",
                height: "100%",
                alignItems: "center",
              }}
            >
              <Typography fontSize={"2em"}>
                No currently active channel
              </Typography>
            </div>
          </>
        )}
      </MessagesBox>
      {currentChannel && (
        <MessageInput>
          <form onSubmit={onMessageSend}>
            <Stack flexDirection={"row"}>
              <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <SentimentSatisfiedTwoToneIcon />
              </IconButton>
              <Box
                sx={{ position: "absolute", bottom: "10%" }}
                hidden={!showEmojiPicker}
              >
                <Picker
                  data={Data}
                  onClickOutside={() => {
                    if (showEmojiPicker) setShowEmojiPicker(false)
                  }}
                  onEmojiSelect={(e: any) =>
                    setChatBoxMsg(chatBoxMsg + e.native)
                  }
                />
              </Box>
              <InputBase
                value={chatBoxMsg}
                sx={{ flex: "1", marginLeft: "4px" }}
                placeholder="Enter text"
                onChange={(e: any) => setChatBoxMsg(e.target.value)}
              />
              <IconButton type="submit">
                <SendIcon color="primary" />
              </IconButton>
            </Stack>
          </form>
        </MessageInput>
      )}
    </>
  )
}

export default ChatBox

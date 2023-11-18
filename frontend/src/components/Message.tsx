import { Typography } from "@mui/material"
import { Box, styled } from "@mui/system"
import React, { MutableRefObject } from "react"

type MessageProps = {
  message?: string
  ownerType?: "sender" | "receiver"
  ref?: MutableRefObject<HTMLElement | undefined>
}

const Message = React.forwardRef((props: MessageProps, ref) => {
  const styleBasedOnMessageOwner = (
    ifSender: string,
    ifReceiver: string
  ): string => {
    return props?.ownerType === "sender" ? ifSender : ifReceiver
  }

  const MessageBoxStyle = styled(Box)({
    //msg
    alignSelf: styleBasedOnMessageOwner("flex-end", "flex-start"),
    minWidth: '20px',
    maxWidth: "60%",
    backgroundColor: styleBasedOnMessageOwner("#0079FF", "lightgray"),
    padding: "5px",
    borderRadius: "10px",
    borderBottomLeftRadius: styleBasedOnMessageOwner("10px", "0"),
    borderBottomRightRadius: styleBasedOnMessageOwner("0", "10px"),
  })

  const MessageTextStyle = styled(Typography)({
    //msgContent
    wordBreak: "break-word",
  })

  return (
    <>
      <MessageBoxStyle ref={ref}>
        <MessageTextStyle>{props?.message}</MessageTextStyle>
      </MessageBoxStyle>
    </>
  )
})

export default Message

import { styled } from "@mui/system";
import customScrollbar from "../utils/custom_scrollbar";
import { List } from "@mui/material";

const StyledList = styled(List)({
  zIndex: 0,
  overflowY: "scroll",
  overflow: "auto",
  scrollbarWidth: "thin",
  ...customScrollbar,
})

export default StyledList
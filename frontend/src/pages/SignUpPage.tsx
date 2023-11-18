import { SignUp } from "@clerk/clerk-react"
import {shadesOfPurple} from "@clerk/themes";
import { Box } from "@mui/system";

const SignUpPage = () => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <SignUp signInUrl="/login" appearance={{ baseTheme: shadesOfPurple}} />
      </Box>
    </>
  )
}

export default SignUpPage
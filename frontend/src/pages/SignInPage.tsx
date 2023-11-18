import React, { useState } from "react"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import { useSignIn } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { InputAdornment, IconButton } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from "../providers/SnackbarProvider"

const formStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px",
} as React.CSSProperties

const textFieldStyles = {
  marginBottom: "16px",
  width: "100%",
  position: "relative",
} as React.CSSProperties

const buttonStyles = {
  marginTop: "16px",
  width: "100%",
} as React.CSSProperties

const linkStyles = {
  margin: "8px 0",
  textDecoration: "none",
  color: "#1976D2",
  cursor: "pointer",
} as React.CSSProperties

const SignInForm = () => {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const { isLoaded, signIn, setActive } = useSignIn()
  const { setSnackbar } = useSnackbar()
  if (!isLoaded) {
    return null
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const result = await signIn?.create({
        identifier,
        password,
      })

      if (result?.status === "complete") {
        await setActive!({ session: result.createdSessionId })
        navigate("/")
        setSnackbar({ message: 'Successfully Signed in', severity: 'success'})
      } else {
        console.log(result)
      }
    } catch (err: any) {
      console.error("error", err.errors[0].longMessage)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{ padding: "32px", width: "350px", textAlign: "center" }}
      >
        <Typography variant="h5">Sign In</Typography>
        <form onSubmit={submit} style={formStyles}>
          <TextField
            sx={textFieldStyles}
            label="Email or username"
            type="text"
            variant="outlined"
            value={identifier}
            onChange={handleEmailChange}
          />
          <TextField
            sx={textFieldStyles}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
          <Button
            sx={buttonStyles}
            variant="contained"
            color="primary"
            type="submit"
          >
            Sign In
          </Button>
        </form>
        <Link href="/register" variant="body2" sx={linkStyles}>
          Don't have an account? Register
        </Link>
        {/* <br />
        <Link href="/forgot-password" variant="body2" sx={linkStyles}>
          Forgot Password?
        </Link> */}
      </Paper>
    </Container>
  )
}

export default SignInForm

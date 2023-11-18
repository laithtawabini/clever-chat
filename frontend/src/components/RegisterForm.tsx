import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-react"
import styled from "@emotion/styled"
import {
  Button,
  Input,
  InputLabel,
  Card,
  Typography,
  Snackbar,
} from "@mui/material"
import FormControl from "@mui/material/FormControl"
import { Box } from "@mui/system"
import { useState, forwardRef } from "react"
import { Link } from "react-router-dom"
import MuiAlert, { AlertProps } from "@mui/material/Alert"

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const RegisterForm = () => {
  const { signUp } = useSignUp()
  const [snackbar, setSnackbar] = useState<string>("")
  const FormBox = styled(Box)({
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
  })

  const Form = styled("form")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  })

  const FormCard = styled(Card)({
    height: "40vw",
    padding: "20px 20px",
    color: "white",
    backgroundColor: "lightsteelblue",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  })

  const onRegister = async (event: any) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value
    // const passwordConfirm = event.target.passwordConfirm.value

    try {
      const signedupUser = await signUp?.create({
        emailAddress: email,
        password,
      })
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setSnackbar(error.errors[0].message)
        setTimeout(() => {
          setSnackbar('')
        }, 3000)
      }
    }
  }

  return (
    <>
      <FormBox>
        <FormCard
          sx={{
            height: { xs: "400px", sm: "400px" },
            width: { xs: "250px", sm: "340px" },
          }}
        >
          <Typography
            sx={{
              alignSelf: "flex-start",
              position: "relative",
              left: "20px",
              bottom: "20px",
              fontFamily: "cursive",
            }}
          >
            Clever Chat
          </Typography>
          <Form onSubmit={onRegister}>
            <FormControl sx={{ marginBottom: 3 }}>
              <InputLabel sx={{ fontSize: "10px" }} htmlFor="email">
                Email address
              </InputLabel>
              <Input id="email" />
            </FormControl>
            <FormControl sx={{ marginBottom: 3 }}>
              <InputLabel sx={{ fontSize: "10px" }} htmlFor="password">
                Password
              </InputLabel>
              <Input id="password" type="password" />
            </FormControl>
            <FormControl>
              <InputLabel sx={{ fontSize: "10px" }} htmlFor="passwordConfirm">
                Confirm password
              </InputLabel>
              <Input id="passwordConfirm" type="password" />
            </FormControl>
            <Button
              size="small"
              sx={{ margin: 3 }}
              variant="outlined"
              type="submit"
            >
              Register
            </Button>

            <Typography
              sx={{
                alignSelf: "flex-start",
                fontSize: "0.5em",
                fontStyle: "none",
              }}
            >
              <Link style={{ fontStyle: "none" }} to={"/login"}>
                Already have an account
              </Link>
            </Typography>
          </Form>
        </FormCard>
        <Snackbar open={Boolean(snackbar)}>
          <Alert severity="error">{snackbar}</Alert>
        </Snackbar>
      </FormBox>
    </>
  )
}

export default RegisterForm

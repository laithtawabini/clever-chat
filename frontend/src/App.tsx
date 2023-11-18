import { useAuth } from "@clerk/clerk-react"
import HomePage from "./pages/HomePage"
import { useNavigate } from "react-router-dom"
import { Player } from "@lottiefiles/react-lottie-player"
import loadingBlue from "./animations/loadingBlue.json"

function App() {
  const { isLoaded, isSignedIn } = useAuth()
  const nav = useNavigate()

  if (!isLoaded)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Player autoplay loop style={{ width: "100px" }} src={loadingBlue} />
      </div>
    )

  if (!isSignedIn) nav("/login")

  return <>{isSignedIn && <HomePage />}</>
}

export default App

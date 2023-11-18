import ReactDOM from "react-dom/client"
import App from "./App"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react"
import SignUpPage from "./pages/SignUpPage"
import SignInPage from "./pages/SignInPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import SnackbarProvider from "./providers/SnackbarProvider"
import SocketProvider from "./providers/SocketProvider"
import UnknownPage from "./pages/UnknownPage"

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY)
  throw new Error("Missing Publishable Key")

const clerkPubKey: string = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 0
    },
    mutations: {
      cacheTime: 0
    }
    
  },
})

root.render(
  <SnackbarProvider>
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkPubKey}>
        <SocketProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/register" element={<SignUpPage />} />
              <Route path="/login" element={<SignInPage />} />
              <Route path="*" element={<UnknownPage />}/>
            </Routes>
          </QueryClientProvider>
        </SocketProvider>
      </ClerkProvider>
    </BrowserRouter>
  </SnackbarProvider>
)

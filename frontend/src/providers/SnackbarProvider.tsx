import { Alert, Snackbar } from "@mui/material"
import { createContext, useContext, useEffect, useState } from "react"

interface SnackbarData {
  message: string
  severity?: "error" | "warning" | "info" | "success"
}

interface SnackbarContextObject {
  snackbar?: SnackbarData
  setSnackbar: (newSnackbar: SnackbarData) => void
}

const SnackbarContext = createContext<SnackbarContextObject>({
  snackbar: { message: "", severity: "info" },
  setSnackbar: (newSnackbar: SnackbarData) => {},
})

export const useSnackbar = () => {
  return useContext(SnackbarContext)
}

const SnackbarProvider = ({ children }: any) => {
  const [snackbar, setSnackbar] = useState<SnackbarData>()

  useEffect(() => {
    if(!snackbar) return

    const timeoutId = setTimeout(() => setSnackbar({ message: '' }), 3000)
    return () => clearTimeout(timeoutId)
  }, [snackbar])  

  return (
    <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
      {children}
      <Snackbar
        open={Boolean(snackbar?.message)}
      >
        <Alert severity={snackbar?.severity || "info"}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider

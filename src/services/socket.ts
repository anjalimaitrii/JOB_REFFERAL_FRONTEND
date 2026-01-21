import { io } from "socket.io-client"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const socket = io(`${BASE_URL}`, {
  auth: {
    token: localStorage.getItem("token"),
  },
})

socket.on("connect", () => {
  console.log("socket connected", socket.id)
})

socket.on("connect_error", (err) => {
  console.error(" socket error:", err.message)
})

export default socket

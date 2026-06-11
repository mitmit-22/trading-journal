import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Layout from "./components/Layout"
import Trades from "./pages/Trades"
import Journal from "./pages/Journal"
import Todos from "./pages/Todos"
import Calendar from "./pages/Calendar"


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/trades" element={<PrivateRoute><Trades /></PrivateRoute>} />
      <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
      <Route path="/todos" element={<PrivateRoute><Todos /></PrivateRoute>}/>
      <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>}/>
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App
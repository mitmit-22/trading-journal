import { useEffect, useState } from "react"
import api from "../utils/api"

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"))
  const [trades, setTrades] = useState([])

  useEffect(() => {
    api.get("/trades").then((res) => setTrades(res.data))
  }, [])

  const totalTrades = trades.length
  const winners = trades.filter((t) => t.pnl > 0).length
  const losers = trades.filter((t) => t.pnl < 0).length
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0)
  const winRate = totalTrades > 0 ? ((winners / totalTrades) * 100).toFixed(1) : 0

  const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded shadow p-6">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome back, {user?.name}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Trades" value={totalTrades} color="text-gray-800" />
        <StatCard label="Win Rate" value={`${winRate}%`} color="text-blue-600" />
        <StatCard label="Winners" value={winners} color="text-green-600" />
        <StatCard label="Losers" value={losers} color="text-red-600" />
      </div>
      <div className="mt-6 bg-white rounded shadow p-6">
        <p className="text-gray-500 text-sm">Total P&L</p>
        <p className={`text-3xl font-bold mt-1 ${totalPnl >= 0 ? "text-green-600" : "text-red-600"}`}>
          ₹{totalPnl.toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default Dashboard
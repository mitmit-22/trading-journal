import { useEffect, useState } from "react"
import api from "../utils/api"

function Calendar() {
  const [trades, setTrades] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    api.get("/trades").then((res) => setTrades(res.data))
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

  const getDayPnl = (day) => {
    const dayTrades = trades.filter((t) => {
      const d = new Date(t.entryDate)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
    if (dayTrades.length === 0) return null
    return dayTrades.reduce((sum, t) => sum + t.pnl, 0)
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">←</button>
          <span className="font-semibold">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">→</button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="grid grid-cols-7 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const pnl = day ? getDayPnl(day) : null
            const isToday = day && new Date().getDate() === day &&
              new Date().getMonth() === month && new Date().getFullYear() === year

            let bgColor = "bg-gray-50"
            if (pnl !== null && pnl > 0) bgColor = "bg-green-100"
            if (pnl !== null && pnl < 0) bgColor = "bg-red-100"

            return (
              <div
                key={idx}
                className={`min-h-16 p-2 rounded ${day ? bgColor : ""} ${isToday ? "ring-2 ring-blue-400" : ""}`}
              >
                {day && (
                  <>
                    <p className={`text-xs font-semibold ${isToday ? "text-blue-600" : "text-gray-700"}`}>{day}</p>
                    {pnl !== null && (
                      <p className={`text-xs mt-1 font-bold ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ₹{pnl.toFixed(0)}
                      </p>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 rounded"></div><span className="text-xs text-gray-500">Profit day</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 rounded"></div><span className="text-xs text-gray-500">Loss day</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-50 border rounded"></div><span className="text-xs text-gray-500">No trades</span></div>
      </div>
    </div>
  )
}

export default Calendar
import { useEffect, useState } from "react"
import api from "../utils/api"
import { supabase } from "../utils/supabase"

function Trades() {
  const [trades, setTrades] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [screenshotFile, setScreenshotFile] = useState(null)
  const [form, setForm] = useState({
    ticker: "", direction: "LONG", entryPrice: "", exitPrice: "",
    quantity: "", entryDate: "", exitDate: "", strategy: "", notes: "", emotion: ""
  })

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    const res = await api.get("/trades")
    setTrades(res.data)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleScreenshotChange = (e) => {
    setScreenshotFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let screenshotUrl = null

    if (screenshotFile) {
      const fileName = `${Date.now()}-${screenshotFile.name}`
      const { error } = await supabase.storage
        .from("screenshot")
        .upload(fileName, screenshotFile)

      if (error) {
        console.error("Upload error:", error)
      } else {
        const { data: urlData } = supabase.storage
          .from("screenshot")
          .getPublicUrl(fileName)
        screenshotUrl = urlData.publicUrl
      }
    }

    await api.post("/trades", {
      ...form,
      entryPrice: parseFloat(form.entryPrice),
      exitPrice: parseFloat(form.exitPrice),
      quantity: parseFloat(form.quantity),
      screenshot: screenshotUrl,
    })

    setShowForm(false)
    setScreenshotFile(null)
    setForm({
      ticker: "", direction: "LONG", entryPrice: "", exitPrice: "",
      quantity: "", entryDate: "", exitDate: "", strategy: "", notes: "", emotion: ""
    })
    fetchTrades()
  }

  const handleDelete = async (id) => {
    await api.delete(`/trades/${id}`)
    fetchTrades()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Trades</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {showForm ? "Cancel" : "+ Add Trade"}
        </button>
      </div>

      {showForm && (
  <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 grid grid-cols-2 gap-4">
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Ticker</label>
      <input name="ticker" placeholder="e.g. NIFTY, BTCUSD" value={form.ticker} onChange={handleChange} required className="border p-2 rounded" />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Direction</label>
      <select name="direction" value={form.direction} onChange={handleChange} className="border p-2 rounded">
        <option value="LONG">LONG</option>
        <option value="SHORT">SHORT</option>
      </select>
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Entry Price</label>
      <input name="entryPrice" type="number" placeholder="0.00" value={form.entryPrice} onChange={handleChange} required className="border p-2 rounded" />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Exit Price</label>
      <input name="exitPrice" type="number" placeholder="0.00" value={form.exitPrice} onChange={handleChange} required className="border p-2 rounded" />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Quantity</label>
      <input name="quantity" type="number" placeholder="0" value={form.quantity} onChange={handleChange} required className="border p-2 rounded" />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Strategy</label>
      <input name="strategy" placeholder="e.g. breakout, FVG, scalp" value={form.strategy} onChange={handleChange} className="border p-2 rounded" />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Entry Date & Time</label>
      <input name="entryDate" type="datetime-local" value={form.entryDate} onChange={handleChange} required className="border p-2 rounded" />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Exit Date & Time</label>
      <input name="exitDate" type="datetime-local" value={form.exitDate} onChange={handleChange} required className="border p-2 rounded" />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Emotion</label>
      <input name="emotion" placeholder="e.g. calm, FOMO, rushed" value={form.emotion} onChange={handleChange} className="border p-2 rounded" />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Screenshot (optional)</label>
      <input name="screenshot" type="file" accept="image/*" onChange={handleScreenshotChange} className="border p-2 rounded" />
    </div>
    <div className="flex flex-col gap-1 col-span-2">
      <label className="text-xs text-gray-500">Notes</label>
      <textarea name="notes" placeholder="Post-trade reflection..." value={form.notes} onChange={handleChange} className="border p-2 rounded" rows={3} />
    </div>
    <button type="submit" className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700">
      Save Trade
    </button>
  </form>
)}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Ticker</th>
              <th className="p-3 text-left">Direction</th>
              <th className="p-3 text-left">Entry</th>
              <th className="p-3 text-left">Exit</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">P&L</th>
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Screenshot</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 && (
              <tr><td colSpan="9" className="p-4 text-center text-gray-400">No trades yet</td></tr>
            )}
            {trades.map((trade) => (
              <tr key={trade.id} className="border-t">
                <td className="p-3 font-semibold">{trade.ticker}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${trade.direction === "LONG" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {trade.direction}
                  </span>
                </td>
                <td className="p-3">{trade.entryPrice}</td>
                <td className="p-3">{trade.exitPrice}</td>
                <td className="p-3">{trade.quantity}</td>
                <td className={`p-3 font-semibold ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{trade.pnl.toFixed(2)}
                </td>
                <td className="p-3">{trade.strategy || "-"}</td>
                <td className="p-3">
                  {trade.screenshot ? (
                    <a href={trade.screenshot} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs">
                      View
                    </a>
                  ) : "-"}
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(trade.id)} className="text-red-500 hover:underline text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Trades
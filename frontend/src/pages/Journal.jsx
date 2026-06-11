import { useEffect, useState } from "react"
import api from "../utils/api"

function Journal() {
  const [journals, setJournals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: "", notes: "", plans: "", news: "" })

  useEffect(() => {
    fetchJournals()
  }, [])

  const fetchJournals = async () => {
    const res = await api.get("/journals")
    setJournals(res.data)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post("/journals", form)
    setShowForm(false)
    setForm({ date: "", notes: "", plans: "", news: "" })
    fetchJournals()
  }

  const handleDelete = async (id) => {
    await api.delete(`/journals/${id}`)
    fetchJournals()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Journal</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {showForm ? "Cancel" : "+ New Entry"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required className="border p-2 rounded" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Notes</label>
            <textarea name="notes" placeholder="How did the day go?" value={form.notes} onChange={handleChange} className="border p-2 rounded" rows={3} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Plans</label>
            <textarea name="plans" placeholder="What are you planning for tomorrow?" value={form.plans} onChange={handleChange} className="border p-2 rounded" rows={3} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">News</label>
            <textarea name="news" placeholder="Any market news or events?" value={form.news} onChange={handleChange} className="border p-2 rounded" rows={3} />
          </div>
          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Save Entry
          </button>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {journals.length === 0 && (
          <p className="text-gray-400 text-center mt-8">No journal entries yet</p>
        )}
        {journals.map((journal) => (
          <div key={journal.id} className="bg-white rounded shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{new Date(journal.date).toDateString()}</h3>
              <button onClick={() => handleDelete(journal.id)} className="text-red-500 hover:underline text-xs">Delete</button>
            </div>
            {journal.notes && <div className="mb-3"><p className="text-xs text-gray-500 mb-1">Notes</p><p className="text-sm">{journal.notes}</p></div>}
            {journal.plans && <div className="mb-3"><p className="text-xs text-gray-500 mb-1">Plans</p><p className="text-sm">{journal.plans}</p></div>}
            {journal.news && <div><p className="text-xs text-gray-500 mb-1">News</p><p className="text-sm">{journal.news}</p></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Journal
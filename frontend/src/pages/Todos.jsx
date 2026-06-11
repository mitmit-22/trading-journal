import { useEffect, useState } from "react"
import api from "../utils/api"

function Todos() {
  const [todos, setTodos] = useState([])
  const [form, setForm] = useState({ title: "", dueDate: "" })

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const res = await api.get("/todos")
    setTodos(res.data)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post("/todos", form)
    setForm({ title: "", dueDate: "" })
    fetchTodos()
  }

  const handleToggle = async (todo) => {
    await api.put(`/todos/${todo.id}`, { ...todo, isCompleted: !todo.isCompleted })
    fetchTodos()
  }

  const handleDelete = async (id) => {
    await api.delete(`/todos/${id}`)
    fetchTodos()
  }

  const pending = todos.filter((t) => !t.isCompleted)
  const completed = todos.filter((t) => t.isCompleted)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Todos</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <input
            name="title"
            placeholder="Add a new task..."
            value={form.title}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col gap-1">
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add
        </button>
      </form>

      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-semibold text-gray-600 mb-3">Pending ({pending.length})</h3>
          <div className="flex flex-col gap-2">
            {pending.length === 0 && <p className="text-gray-400 text-sm">No pending tasks</p>}
            {pending.map((todo) => (
              <div key={todo.id} className="bg-white rounded shadow p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={todo.isCompleted} onChange={() => handleToggle(todo)} className="w-4 h-4 cursor-pointer" />
                  <span className="text-sm">{todo.title}</span>
                  {todo.dueDate && <span className="text-xs text-gray-400">Due: {new Date(todo.dueDate).toDateString()}</span>}
                </div>
                <button onClick={() => handleDelete(todo.id)} className="text-red-500 hover:underline text-xs">Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-600 mb-3">Completed ({completed.length})</h3>
          <div className="flex flex-col gap-2">
            {completed.length === 0 && <p className="text-gray-400 text-sm">No completed tasks</p>}
            {completed.map((todo) => (
              <div key={todo.id} className="bg-white rounded shadow p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={todo.isCompleted} onChange={() => handleToggle(todo)} className="w-4 h-4 cursor-pointer" />
                  <span className="text-sm line-through text-gray-400">{todo.title}</span>
                  {todo.dueDate && <span className="text-xs text-gray-400">Due: {new Date(todo.dueDate).toDateString()}</span>}
                </div>
                <button onClick={() => handleDelete(todo.id)} className="text-red-500 hover:underline text-xs">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Todos
"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleTaskStatus,
} from "@/services/api"

export default function Dashboard() {
  const router = useRouter()

  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [showProfile, setShowProfile] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.replace("/login")
    else {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUserEmail(payload.email)
      fetchTasks()
    }
  }, [])

  const fetchTasks = async () => {
    const token = localStorage.getItem("token")
    const data = await getTasks(token!)
    setTasks(Array.isArray(data) ? data : [])
  }

  const handleCreateOrUpdate = async () => {
    if (!title) return toast.error("Title required")

    const token = localStorage.getItem("token")

    const taskData = {
      title,
      description,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    }

    if (editingId) {
      await updateTask(token!, editingId, taskData)
      toast.success("Task updated")
      setEditingId(null)
    } else {
      await createTask(token!, taskData)
      toast.success("Task created")
    }

    setTitle("")
    setDescription("")
    setDueDate("")
    fetchTasks()
  }

  const handleEdit = (task: any) => {
    setTitle(task.title)
    setDescription(task.description)
    setDueDate(task.due_date?.slice(0, 10) || "")
    setEditingId(task._id)
  }

  const handleStatusChange = async (task: any) => {
    const token = localStorage.getItem("token")
    await toggleTaskStatus(token!, task._id, task.status)
    fetchTasks()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return
    const token = localStorage.getItem("token")
    await deleteTask(token!, id)
    fetchTasks()
  }

  const filteredTasks = useMemo(() => {
    let filtered = tasks

    if (filter === "completed")
      filtered = filtered.filter(t => t.status === "completed")

    if (filter === "pending")
      filtered = filtered.filter(t => t.status === "pending")

    if (search)
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase())
      )

    return filtered
  }, [tasks, filter, search])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.replace("/login")
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="bg-gray-800 px-4 py-2 rounded-lg"
          >
            Profile
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 bg-gray-900 p-4 rounded-lg shadow-xl w-48">
              <p className="text-sm text-gray-400">{userEmail}</p>
              <button
                onClick={handleLogout}
                className="mt-3 text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        {["all", "completed", "pending"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded ${
              filter === type
                ? "bg-blue-600"
                : "bg-gray-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* CREATE TASK */}
      <div className="bg-gray-900 p-6 rounded-lg flex gap-4 mb-10">
        <input
          className="bg-white text-black p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          className="bg-white text-black p-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <input
          className="bg-white text-black p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleCreateOrUpdate}
          className="bg-green-600 px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* TASK LIST */}
      <div className="space-y-6">
        {filteredTasks.map(task => {
          const isOverdue =
            task.due_date &&
            new Date(task.due_date) < new Date() &&
            task.status !== "completed"

          return (
            <div
              key={task._id}
              className="bg-gray-800 p-6 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {task.title}
                </h3>
                <p className="text-gray-400">
                  {task.description}
                </p>

                {task.due_date && (
                  <p
                    className={`text-sm mt-2 ${
                      isOverdue
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    Due:{" "}
                    {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusChange(task)}
                  className="bg-blue-600 px-4 py-2 rounded"
                >
                  {task.status === "completed"
                    ? "Mark Pending"
                    : "Mark Completed"}
                </button>

                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-500 px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-600 px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
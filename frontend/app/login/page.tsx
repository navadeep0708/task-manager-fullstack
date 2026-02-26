"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "@/services/api"

export default function Login() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await loginUser(form)

      if (data.access_token) {
        localStorage.setItem("token", data.access_token)
        router.push("/dashboard")
      } else {
        alert(data.detail || "Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Server error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded text-white font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
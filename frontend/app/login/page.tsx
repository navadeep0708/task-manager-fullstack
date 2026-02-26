"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function Login() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("token", data.access_token)
        toast.success("Login successful")
        router.replace("/dashboard")
      } else {
        toast.error(data.detail || "Login failed")
      }
    } catch {
      toast.error("Server error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <div className="bg-gray-900 p-10 rounded-xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 bg-white text-black rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-3 bg-white text-black rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  )
}
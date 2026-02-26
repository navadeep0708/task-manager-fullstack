"use client"

import { useState } from "react"
import { registerUser } from "@/services/api"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Register() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await registerUser(form)

      if (result.message) {
        setSuccess("Registration successful! Redirecting to login...")
        
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } else {
        setError(result.detail || "Registration failed")
      }
    } catch (err) {
      console.error("Register error:", err)
      setError("Server error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-96 space-y-5"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Register
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {success && (
          <p className="text-green-400 text-sm text-center">{success}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
        />

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
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <div className="text-center pt-2">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
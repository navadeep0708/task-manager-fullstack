"use client";

import { useState } from "react";
import { registerUser } from "@/services/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await registerUser(form);

    if (result.message) {
      alert("Registration successful!");
      router.push("/login");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}
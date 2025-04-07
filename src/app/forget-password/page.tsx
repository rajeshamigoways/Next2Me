

"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "../components/button"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import forgetimage from "../../../public/images/forgot-password.jpg"
import Url from "../Urls"

export default function ForgotPassword() {
  const [emailFocused, setEmailFocused] = useState(false)
  const [open, setOpen] = useState(true)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("Please enter a valid input.")
      return
    }

    try {
      const response = await fetch(`${Url}/email/checkmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Check your email to reset your password")
        console.log("Admin Email: ", data)
      } else {
        toast.error("Invalid admin email or username!")
      }
    } catch (error) {
      toast.error("An error occurred while checking the email.")
    }
  }

  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 py-16 px-6">
        <div className="relative w-full max-w-3xl bg-white  rounded-3xl shadow-lg flex">
          {/* Left Side - Image (Reduced to 40% width) */}
          <div className="w-2/5 hidden md:block relative ml-6">
            <Image
              src={forgetimage} // Replace with actual image
              alt="Forgot Password"
              layout="fill"
              objectFit="cover"
              className="rounded-l-lg"
            />
          </div>

          {/* Right Side - Form (Now 60% width) */}
          <div className="w-3/5 py-10 px-8 flex flex-col justify-center">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">Forgot Password</h2>
              <p className="text-sm text-gray-500">
                No worries! Enter your email or username, and we will send you a reset password link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6 mt-6">
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="block px-3 pb-3 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                />
                <label
                  className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-3 z-10 bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-indigo-600 ${
                    emailFocused || email ? "text-indigo-600 left-3" : "text-gray-500 left-3"
                  }`}
                >
                  Enter Your User Name or Email
                </label>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3" disabled={!email.trim()}>
                Send Request
              </Button>
            </form>
          </div>
        </div>

        <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />
      </div>
    )
  )
}

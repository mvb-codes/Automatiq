import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate({ from: "/signup" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/auth/signup/`,
        {
          email: form.email,
          password: form.password, // ensures you're sending a plain string
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate({ to: "/" });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "SignUp failed. Try Again.";
      alert(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-sm shadow-xl bg-base-100">
          <form className="card-body" onSubmit={handleSignup}>
            <h2 className="card-title justify-center mb-4">Sign Up</h2>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered"
              required
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered"
              required
              value={form.password}
              onChange={handleChange}
            />

            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
            <div className="flex justify-center">
              <p className="text-center text-sm mt-2">
                Already have an account?{" "}
                <a href="/login" className="link link-primary">
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

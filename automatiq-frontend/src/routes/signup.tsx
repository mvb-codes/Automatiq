// Assume this file is /routes/signup.tsx
import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useToastStore } from "../stores/useToastStore.tsx";

// 🔧 Component: SkillsInput
const SkillsInput = (props) => {
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !skills.includes(trimmed)) {
        setSkills([...skills, trimmed]);
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) =>
    setSkills(skills.filter((skill) => skill !== skillToRemove));

  const handleSkillsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!skills.length) {
      showToast("Skills cannot be empty.", "error");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/auth/update-skills/`,
        { skills },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200) {
        showToast(`Submitted skills: ${skills.join(", ")}`, "success");
        props.navigate({ to: "/" });
      } else {
        showToast(`Unexpected response: ${response.statusText}`, "error");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong.";
      showToast(`Error: ${message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="card-title justify-center mb-4">Tell us your skills</h2>
      <form onSubmit={handleSkillsSubmit}>
        <input
          type="text"
          className="input w-full mb-4"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleSkillKeyDown}
          placeholder="Type a skill and press Enter"
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, idx) => (
            <div key={idx} className="badge badge-neutral py-3 px-4 text-sm">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!skills.length || loading}
        >
          {loading ? "Submitting..." : "Submit Skills"}
        </button>
      </form>
    </div>
  );
};

// 🔧 Main Signup Route
export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate({ from: "/signup" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/auth/signup/`,
        form,
        { headers: { "Content-Type": "application/json" } },
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setStep(2);
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <progress
            className="progress progress-primary w-full mb-4"
            value={step === 1 ? 50 : 100}
            max="100"
          />
          {step === 1 ? (
            <>
              <h2 className="card-title justify-center mb-4">Sign Up</h2>
              <form onSubmit={handleSignup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered mb-2 w-full"
                  required
                  value={form.email}
                  onChange={handleChange}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered mb-4 w-full"
                  required
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  className="btn btn-accent w-full"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>

                <div className="divider">or</div>
                <button className="btn bg-base-200 w-full" type="button">
                  <ion-icon name="logo-google" className="mr-2"></ion-icon>
                  Sign up with Google
                </button>
              </form>
            </>
          ) : (
            <SkillsInput navigate={navigate} />
          )}
        </div>
      </div>
    </div>
  );
}

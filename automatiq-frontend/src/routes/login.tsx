import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form className="card-body">
          <h2 className="card-title justify-center mb-4">Log In</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            required
          />

          <div className="form-control mt-4">
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </div>
          <div className="flex justify-center">
            <p className="text-center text-sm mt-2">
              Do not have an account?{" "}
              <a href="/signup" className="link link-primary">
                SignUp
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

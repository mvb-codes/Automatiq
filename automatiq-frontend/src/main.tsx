import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./stores/auth.tsx";
import ToastContainer from "./components/ToastContainer.tsx";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // Required by TanStack
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuthStore();
  return (
    <>
      <RouterProvider router={router} context={{ auth }} />;
      <ToastContainer />
    </>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <InnerApp />
    </StrictMode>,
  );
}

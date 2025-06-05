import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./utils/i18n.tsx";
import {store} from "./store/store.ts";
import { Provider } from "react-redux";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
            <Suspense
              fallback={<div className="text-center mt-10">Loading...</div>}
            >
              <RouterProvider router={router} />
            </Suspense>
          </GoogleOAuthProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);

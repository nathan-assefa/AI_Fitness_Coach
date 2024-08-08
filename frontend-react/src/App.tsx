import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./store";
import { Toaster } from "sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./lib/providers/auth-provider";
import PrivateRoutes from "./components/private_route";
import ChatPage from "./pages/ChatPage";
import { ChakraProvider } from "@chakra-ui/react";
import AuthPage from "./pages/AuthPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SubscriptionPage from "./pages/SubscriptionPage";

const queryClient = new QueryClient();

function App() {
  const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log("GOOGLE ID: ", GOOGLE_CLIENT_ID);
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Router>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Toaster richColors />
              <Routes>
                <Route element={<PrivateRoutes />}>
                  <Route
                    path="/chat-page/:id"
                    element={
                      <ChakraProvider>
                        <ChatPage />
                      </ChakraProvider>
                    }
                  />
                </Route>
                <Route path="/" element={<Home />} />
                <Route
                  path="/subscription-page"
                  element={<SubscriptionPage />}
                />

                <Route
                  path="/auth-page"
                  element={
                    <ChakraProvider>
                      <AuthPage />
                    </ChakraProvider>
                  }
                />
              </Routes>
            </AuthProvider>
          </QueryClientProvider>
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;

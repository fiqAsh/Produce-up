import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Router,
  Routes,
  useLocation,
  Route,
} from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";
import Loading from "./components/Loading";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

const AuthWrapper = ({ children }) => {
  const { checkAuth, checkingAuth } = useAuthStore;
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname !== "/signup") {
      checkAuth();
    } else {
      useAuthStore.setState({ checkingAuth: false });
    }
  }, [location.pathname]);

  if (checkingAuth) {
    return <Loading />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthWrapper>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </AuthWrapper>
    </Router>
  );
};

export default App;

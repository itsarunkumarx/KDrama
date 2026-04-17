import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Entry from "./pages/Entry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watch from "./pages/Watch";
import WatchParty from "./pages/WatchParty";
import SearchPage from "./pages/SearchPage";
import Profile from "./pages/Profile";
import TraktCallback from "./pages/TraktCallback";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-kdark flex items-center justify-center">
        <div className="text-kred text-5xl font-display tracking-widest animate-pulse">
          KDRAMAX
        </div>
      </div>
    );
  if (!user) return <Navigate to="/entry" replace />;
  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-kdark">
      {user && <Navbar />}
      <Routes>
        <Route path="/entry" element={user ? <Navigate to="/" /> : <Entry />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watch/:id"
          element={
            <ProtectedRoute>
              <Watch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/party/:roomId"
          element={
            <ProtectedRoute>
              <WatchParty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/auth/trakt/callback" element={<TraktCallback />} />

        <Route path="*" element={<Navigate to="/entry" replace />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

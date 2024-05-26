// import { useState } from 'react'
import "./App.css";
import { RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";

// ui components export
import Login from "./modules/loginSignup/Login";
import Signup from "./modules/loginSignup/Signup";
import ProtectedRoute from "./auth/ProtectedRoute/ProtectedRoute";
import Dashboard from "./modules/teacher/Dashboard";
import HomePage from "./modules/teacher/pages/HomePage";
import ClassRoom from "./modules/teacher/pages/ClassRoom";
import LeavePage from "./modules/teacher/pages/LeavePage";
// import Sidebar from "./components/Sidebar";
// import OutsideClick from "./hooks/outsideClick";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/class",
        element: (
          <ProtectedRoute>
            <ClassRoom />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leave",
        element: (
          <ProtectedRoute>
            <LeavePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {

  return (
    <div className="flex">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

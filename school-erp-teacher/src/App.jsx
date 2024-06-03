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
import Library from "./modules/teacher/pages/Library";
import TimeTable from "./modules/teacher/pages/TimeTable";
import SupportPage from "./modules/teacher/pages/SupportPage";
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
      {
        path: "/library",
        element: (
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        ),
      },
      {
        path: "/timeTable",
        element: (
          <ProtectedRoute>
            <TimeTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/support",
        element: (
          <ProtectedRoute>
            <SupportPage />
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

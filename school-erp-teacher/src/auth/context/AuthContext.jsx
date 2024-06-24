import { createContext, useReducer, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        id: action.payload.id,
        data: action.payload.data,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        id: null,
        data: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    id: null,
    data: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchData(id) {
      const response = await axios.get(`https://erp-system-backend.onrender.com/api/v1/teacher/6/fetch/${id}`);
      return response.data.data;
    }

    if (token) {
      try {
        const data = jwtDecode(token);
        if (data.id) {
          fetchData(data.id).then((studentData) => {
            dispatch({ type: "LOGIN", payload: { id: data.id, data: studentData } });
            setLoading(false);
          }).catch(error => {
            console.error("Error fetching data:", error);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await axios.post(
      `https://erp-system-backend.onrender.com/api/v1/teacher/login`,
      credentials
    );
    const responseData = response.data;
    if (responseData.token) {
      localStorage.setItem("token", responseData.token);
      const { id } = jwtDecode(responseData.token);
      const studentData = await axios.get(`https://erp-system-backend.onrender.com/api/v1/teacher/${responseData.teacherData.campusId}/fetch/${responseData.teacherData.id}`).then(res => res.data.data);
      dispatch({ type: "LOGIN", payload: { id: id, data: studentData } });
    }
    return { message: responseData.message, success: responseData.success };
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        id: state.id,
        data: state.data,
        isAuthenticated: state.isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

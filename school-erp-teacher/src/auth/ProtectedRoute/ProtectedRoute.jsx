import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

  const { isAuthenticated } = useContext(AuthContext);
  // const { isAuthenticated } = true;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login", { replace: true });
    }
    else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
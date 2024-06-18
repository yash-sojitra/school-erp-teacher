import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

  const { data , isAuthenticated } = useContext(AuthContext);
  // const { isAuthenticated } = true;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    console.log("Data changed");
    console.log(data);
    if (data === null) {
      navigate("/login", { replace: true });
    }
    else {
      if(children.type.name == "TimeTable" && data.AdditionalRole != "class teacher"){
        navigate("/")
      }
      else {
        setLoading(false);
      }
    }
  }, [isAuthenticated, navigate, data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
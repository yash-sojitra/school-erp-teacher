import LeaveTable from "../components/LeavePage/LeaveTable";
import LeaveForm from "../components/LeavePage/LeaveForm";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/auth/context/AuthContext";
import axios from "axios";

const LeavePage = () => {

  const { data } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    async function fetchLeaves(id) {
      try {
        const response = await axios.get(
          `https://erp-system-backend.onrender.com/api/v1/leave/fetch-leaves/${id}`
        );
        setLeaves(response.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchLeaves(data.id);
  }, []);

  return (
    <div className="w-full mx-6 md:mr-0">
      <div className="w-full flex justify-between align-bottom my-4">
      <h1 className="text-3xl font-bold">Leave Application</h1>
        <LeaveForm leaves={leaves} setLeaves={setLeaves} />
      </div>
      <LeaveTable leaves={leaves} />
    </div>
  );
};

export default LeavePage;

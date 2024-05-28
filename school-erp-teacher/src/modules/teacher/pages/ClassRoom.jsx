import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTodaysDate, getTodaysDay } from "../utils/dateFormatter";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/auth/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { OctagonAlert } from "lucide-react";
import axios from "axios";
import Profile from "../components/classroom/Profile";

const ClassRoom = () => {
  const { data } = useContext(AuthContext);

  const subjects = data.subject;

  const [present, setPresent] = useState([]);
  const [crrSubject, setCrrSubject] = useState(subjects[0]);
  const [crrStudents, setCrrStudents] = useState([]);
  const [err, setError] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      setError(false)
      try {
        const response = await axios.get(
          `https://erp-system-backend.onrender.com/api/v1/student/${data.campusId}/fetchByDepartment/${crrSubject.department.id}`
        );
        if (response.data.data != undefined) setCrrStudents(response.data.data);
        else setError("no student in dept");
      } catch (err) {
        console.log(err);
        setError("error fetching data");
      }
    }

    fetchStudents();
  }, [crrSubject]);

  async function handleSubmit(){
    
    try {
      const response = await axios.post("https://erp-system-backend.onrender.com/api/v1/attendance/mark",{
        subjectId: crrSubject.id,
        selectedStudents: present
      })
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

  }
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold pt-4">Student Attendance</h1>
      <p className="font-medium py-3">
        {getTodaysDate() + ", " + getTodaysDay()}
      </p>
      <div className="flex gap-4">
        {subjects.map((subject) => {
          return (
            <Badge
              className="text-xl px-4 py-1 cursor-pointer"
              variant={crrSubject == subject ? "" : "secondary"}
              key={subject.id}
              onClick={() => {
                setCrrSubject(subject);
              }}
            >
              {subject.subjectName} - {subject.department.name}
            </Badge>
          );
        })}
      </div>
      <div className="flex gap-6 flex-wrap">
        {
        err?
          <div className="text-lg font-medium text-red-600 py-6 flex items-center gap-4"><OctagonAlert />{err}</div>
        :
        crrStudents.map((student) => (
          <div
            key={student.id}
            className={`flex flex-col gap-2 border items-center text-center bg-white rounded-xl my-4 p-4 shadow-lg ${
              present.includes(student.id)
                ? "shadow-xl shadow-primary-foreground/20"
                : ""
            }`}
          >
            <Avatar className="size-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="text-xl font-medium">{student.name}</h1>
            <Button
              onClick={() => {
                if (present.includes(student.id)) {
                  setPresent(present.filter((id) => id !== student.id));
                } else {
                  setPresent([...present, student.id]);
                }
              }}
            >
              Mark Attendance
            </Button>
            <Profile student={student} departmentId={crrSubject.department.id} />
          </div>
        ))}
      </div>

      {err?<Button disabled>Submit</Button>:<Button onClick={handleSubmit}>Submit</Button>}

      
    </div>
  );
};

export default ClassRoom;

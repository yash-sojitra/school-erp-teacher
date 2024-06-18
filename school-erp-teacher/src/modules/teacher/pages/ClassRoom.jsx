import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTodaysDate, getTodaysDay } from "../utils/dateFormatter";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/auth/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { CircleCheckBig, OctagonAlert } from "lucide-react";
import axios from "axios";
import Profile from "../components/classroom/Profile";

//for datepicker
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ClassRoom = () => {
  const { data } = useContext(AuthContext);

  const subjects = data.subject;

  const [present, setPresent] = useState([]);
  const [crrSubject, setCrrSubject] = useState(subjects[0]);
  const [crrStudents, setCrrStudents] = useState([]);
  const [pastAttendance, setPastAttendance] = useState([]);
  const [date, setDate] = useState(new Date());
  const [err, setError] = useState(false);

  async function fetchStudents() {
    setError(false);
    try {
      const response = await axios.get(
        `https://erp-system-backend.onrender.com/api/v1/student/${data.campusId}/fetchByDepartment/${crrSubject.department.id}`
      );
      if (response.data.data != undefined) setCrrStudents(response.data.data);
      else setError("no student in department");
    } catch (err) {
      console.log(err);
      setError("error fetching data");
    }
  }

  async function fetchAttendance(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; // Months are zero-indexed
    const yy = date.getFullYear();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const datestring = dd + "-" + mm + "-" + yy;
    try {
      const response = await axios.get(
        `https://erp-system-backend.onrender.com/api/v1/attendance/byDate/${crrSubject.id}/${datestring}`
      );
      console.log(response.data.success);

      if (response.data.success) {
        let tempArr = [];
        response.data.data.forEach((element) => {
          if(element.status == "Present"){
            tempArr.push(element.studentId);
          }
        });
        // console.log(tempArr);
        setPastAttendance(tempArr);
        // console.log(pastAttendance);
      }
    } catch (error) {
      if(error.response.status != 404){
        console.log(error.response.status);
        setError(error.message);
      }
    }
  }

  useEffect(() => {
    fetchStudents();
    fetchAttendance(date);
  }, [crrSubject]);

  async function handleSubmit() {
    try {
      const response = await axios.post(
        "https://erp-system-backend.onrender.com/api/v1/attendance/mark",
        {
          subjectId: crrSubject.id,
          selectedStudents: present,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold pt-4">Student Attendance</h1>
      <p className="font-medium py-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
      <table className="w-full my-6 bg-white text-center align-baseline table-fixed">
        <tr>
          <th className="p-4">Name</th>
          <th>Attendance</th>
          <th>Profile</th>
        </tr>
        {err ? (
          <div className="text-lg font-medium text-red-600 py-6 flex items-center gap-4">
            <OctagonAlert />
            {err}
          </div>
        ) : (
          crrStudents.map((student) => (
            <tr key={student.id}>
              <td className="flex gap-2 items-center py-4 pl-4">
                <Avatar className="size-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="text-xl font-medium">{student.name}</h1>
                {(present.includes(student.id) ||
                  pastAttendance.includes(student.id)) && (
                  <CircleCheckBig className="size-5" color="#62ce3b" />
                )}
              </td>
              <td>
                {pastAttendance.includes(student.id) ? (
                  <Button disabled>marked</Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (present.includes(student.id)) {
                        setPresent(present.filter((id) => id !== student.id));
                      } else {
                        setPresent([...present, student.id]);
                      }
                    }}
                  >
                    {present.includes(student.id)
                      ? "Unmark"
                      : "Mark Attendance"}
                  </Button>
                )}
              </td>
              <td>
                <Profile
                  student={student}
                  departmentId={crrSubject.department.id}
                />
              </td>
            </tr>
          ))
        )}
      </table>

      {err ? (
        <Button disabled>Submit</Button>
      ) : (
        <Button onClick={handleSubmit}>Submit</Button>
      )}
    </div>
  );
};

export default ClassRoom;
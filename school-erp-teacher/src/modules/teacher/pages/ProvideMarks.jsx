import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTodaysDate, getTodaysDay } from "../utils/dateFormatter";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/auth/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import Profile from "../components/classroom/Profile";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Marks = () => {
  const { data } = useContext(AuthContext);
  const subjects = data.subject;

  const [crrSubject, setCrrSubject] = useState(subjects[0]);
  const [crrStudents, setCrrStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [err, setError] = useState(false);

  const [currentStudent, setCurrentStudent] = useState(null);
  const [totalMarks, setTotalMarks] = useState("");
  const [scoredMarks, setScoredMarks] = useState("");
  const [grade, setGrade] = useState("");

  async function fetchStudents() {
    setError(false);
    try {
      const response = await axios.get(
        `https://erp-system-backend.onrender.com/api/v1/student/${data.campusId}/fetchByDepartment/${crrSubject.department.id}`
      );
      if (response.data.data != undefined) setCrrStudents(response.data.data);
      else {
        setError("No student in department");
      }
    } catch (err) {
      console.log(err);
      setError("Error fetching data");
    }
  }

  useEffect(() => {
    fetchStudents();
  }, [crrSubject]);

  useEffect(() => {
    setSearchData(() =>
      crrStudents.filter((student) => student.name.includes(search))
    );
  }, [search, crrStudents]);

  async function handleSubmitMarks(e) {
    e.preventDefault();
    console.log("Submitting marks...");
    console.log("Total Marks:", totalMarks);
    console.log("Scored Marks:", scoredMarks);
    console.log("Grade:", grade);
    console.log("Current Student:", currentStudent);
    console.log("Current Subject:", crrSubject);
    try {
      const response = await axios.post(
        `https://erp-system-backend.onrender.com/api/v1/results/campus/${data.campusId}/reg`,
        [{
          totalMarks: Number(totalMarks),
          scoredMarks: Number(scoredMarks),
          grade,
          subjectId: crrSubject.id,
          studentId: currentStudent.id,
        }]
      );
      console.log(response.data);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setCurrentStudent(null);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }

  async function handleUpdateMarks(e) {
    e.preventDefault();
    console.log("Updating marks...");
    console.log("Total Marks:", totalMarks);
    console.log("Scored Marks:", scoredMarks);
    console.log("Grade:", grade);
    console.log("Current Student:", currentStudent);
    console.log("Current Subject:", crrSubject);
    try {
      const response = await axios.patch(
        `https://erp-system-backend.onrender.com/api/v1/results/campus/${data.campusId}/${currentStudent.id}/${crrSubject.id}`,
        {
          totalMarks: Number(totalMarks),
          scoredMarks: Number(scoredMarks),
          grade,
        }
      );
      console.log(response.data);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setCurrentStudent(null);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }

  function openDialog(student) {
    setCurrentStudent(student);
    setTotalMarks("");
    setScoredMarks("");
    setGrade("");
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold pt-4">Student Marks</h1>
      <div className="flex gap-4">
        {subjects.map((subject) => (
          <Badge
            className="text-xl px-4 py-1 cursor-pointer"
            variant={crrSubject === subject ? "" : "secondary"}
            key={subject.id}
            onClick={() => setCrrSubject(subject)}
          >
            {subject.subjectName} - {subject.department.name}
          </Badge>
        ))}
      </div>
      <Input
        className="mt-6 bg-white w-72"
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full my-6 bg-white text-center align-baseline">
        <thead>
          <tr>
            <th className="p-4">Enrollment No</th>
            <th className="text-left pl-4">Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {err ? (
            <tr>
              <td colSpan="3" className="text-lg font-medium text-red-600 py-6 flex items-center gap-4">
                {err}
              </td>
            </tr>
          ) : (
            searchData.map((student) => (
              <tr key={student.id}>
                <td className="font-bold text-xl">{student.rollNo}</td>
                <td className="flex gap-2 items-center py-4 pl-4">
                  <Avatar className="size-12">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <h1 className="text-xl font-medium">{student.name}</h1>
                </td>
                <td>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => openDialog(student)}>Provide Marks</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Provide Marks for {student.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitMarks}>
                        <div>
                          <label>Total Marks</label>
                          <Input
                            value={totalMarks}
                            onChange={(e) => setTotalMarks(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label>Scored Marks</label>
                          <Input
                            value={scoredMarks}
                            onChange={(e) => setScoredMarks(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label>Grade</label>
                          <Input
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit">Submit</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => openDialog(student)}>Update Marks</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Marks for {student.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateMarks}>
                        <div>
                          <label>Total Marks</label>
                          <Input
                            value={totalMarks}
                            onChange={(e) => setTotalMarks(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label>Scored Marks</label>
                          <Input
                            value={scoredMarks}
                            onChange={(e) => setScoredMarks(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label>Grade</label>
                          <Input
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit">Update</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Marks;

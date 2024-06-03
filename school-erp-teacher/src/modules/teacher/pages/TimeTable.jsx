import { AuthContext } from "@/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Clock10,
  MoveLeft,
  PenSquareIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const daysofWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const initTable = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
};

const TimeTable = () => {
  const { data } = useContext(AuthContext);
  const [displayForm, setDisplayForm] = useState(false);
  const [timeTable, setTimeTable] = useState(initTable);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeDay, setActiveDay] = useState(daysofWeek[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchTimeTable() {
    try {
      const response = await axios.get(
        `https://erp-system-backend.onrender.com/api/v1/timeTable/fetch-byDepartment/${data.departmentId}`
      );
      // console.log(response.data.timeTable[0]);
      if (response.data.timeTable.length === 0) {
        const postResponse = await axios.post(`https://erp-system-backend.onrender.com/api/v1/timeTable/upload/${data.id}`,{
          departmentId: data.departmentId,
        })
      }
      else{
        setTimeTable(response.data.timeTable[0]);
      }
    } catch (e) {
      console.log(e);
      setError("couldn't fetch time table");
    }
  }

  async function fetchDept() {
    try {
      const response = await axios.get(
        `https://erp-system-backend.onrender.com/api/v1/department/fetch/${data.departmentId}`
      );
      // console.log(response.data.data.subjects);
      setSubjects(response.data.data.subjects);
    } catch (e) {
      setError("couldn't fetch time department data");
      console.log(e);
    }
  }

  async function fetchAllTeachers() {
    try {
      const response = await axios.get(
        `https://erp-system-backend.onrender.com/api/v1/teacher/${data.campusId}/fetchAll`
      );
      // console.log(response.data.data);
      setTeachers(response.data.data);
      setLoading(false);
    } catch (e) {
      setError("couldn't fetch teachers");
      console.log(e);
    }
  }

  function addPeriod() {
    const newPeriod = {
      timeTo: "",
      timeFrom: "",
      subjectId: null,
      teacherId: null,
      subjectName: "",
      teacherName: "",
    };
    setTimeTable((prevState) => ({
      ...prevState,
      [activeDay]: [...prevState[activeDay], newPeriod],
    }));
  }

  async function saveTimeTable() {
    console.log("clicked");
    try {
      const response = await axios.put(
        `https://erp-system-backend.onrender.com/api/v1/timeTable/update/${data.id}`,
        {
          ...timeTable,
          departmentId: data.departmentId,
        }
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
      setError("couldn't update time table");
    }
  }

  useEffect(() => {
    setError(false);

    



    fetchTimeTable();
    fetchDept();
    fetchAllTeachers();
  }, []);

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between">
        <p className="text-2xl font-bold">Time Table</p>
        <Button
          className="flex gap-2"
          onClick={() => {
            setDisplayForm(!displayForm);
          }}
        >
          {displayForm ? (
            <>
              <MoveLeft className="size-5" />
              <p>go back</p>
            </>
          ) : (
            <>
              <PenSquareIcon className="size-5" />
              <p>edit</p>
            </>
          )}
        </Button>
      </div>

      {/* table&form  */}

      {displayForm ? (
        <>
          <div className="flex gap-4">
            {daysofWeek.map((day) => {
              return (
                <Badge
                  key={day}
                  variant={activeDay === day ? "" : "outline"}
                  className="text-lg cursor-pointer"
                  onClick={() => {
                    setActiveDay(day);
                    console.log(timeTable);
                  }}
                >
                  {day}
                </Badge>
              );
            })}
          </div>
          {loading ? (
            <div>loading</div>
          ) : (
            <div className="w-full py-6">
              {timeTable[activeDay].map((period) => {
                return (
                  <div
                    className="flex gap-4 justify-between items-center"
                    key={period.subjectName}
                  >
                    <select
                      name="subject"
                      id="subject"
                      className="p-2"
                      onChange={(e) => {
                        // console.log(e.target.value.split(" ",2));
                        period.subjectId = parseInt(
                          e.target.value.split(" ", 2)[0]
                        );
                        period.subjectName = e.target.value.split(" ", 2)[1];
                        // console.log(timeTable);
                        setTimeTable(timeTable);
                      }}
                    >
                      {subjects.map((subject) => {
                        return (
                          <>
                            {subject.id === period.subjectId ? (
                              <option
                                key={subject.id}
                                value={`${subject.id} ${subject.subjectName}`}
                                selected
                              >
                                {subject.subjectName}
                              </option>
                            ) : (
                              <option
                                key={subject.id}
                                value={`${subject.id} ${subject.subjectName}`}
                              >
                                {subject.subjectName}
                              </option>
                            )}
                          </>
                        );
                      })}
                    </select>
                    <select
                      name="teacher"
                      id="teacher"
                      onChange={(e) => {
                        // console.log(e.target.value);
                        period.teacherId = parseInt(
                          e.target.value.split(" ", 2)[0]
                        );
                        period.teacherName = e.target.value.split(" ", 2)[1];
                        console.log(timeTable);
                        setTimeTable(timeTable);
                      }}
                    >
                      {teachers.map((teacher) => {
                        // console.log(teacher.id);
                        return (
                          <>
                            {teacher.id == period.teacherId ? (
                              <option
                                value={`${teacher.id} ${teacher.name}`}
                                selected
                              >
                                {teacher.name}
                              </option>
                            ) : (
                              <option value={`${teacher.id} ${teacher.name}`}>
                                {teacher.name}
                              </option>
                            )}
                          </>
                        );
                      })}
                    </select>
                    <input
                      type="time"
                      defaultValue={period.timeFrom}
                      onChange={(e) => {
                        period.timeFrom = e.target.value;
                        setTimeTable(timeTable);
                      }}
                    />
                    <input
                      type="time"
                      defaultValue={period.timeTo}
                      onChange={(e) => {
                        period.timeTo = e.target.value;
                        setTimeTable(timeTable);
                      }}
                    />
                    <div
                      className="p-2 text-white rounded-lg bg-red-700"
                      onClick={() => {
                        const filteredPeriods = timeTable[activeDay].filter(
                          (allPeriod) => allPeriod != period
                        );

                        setTimeTable((prevState) => ({
                          ...prevState,
                          [activeDay]: filteredPeriods,
                        }));
                      }}
                    >
                      <Trash2 />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-4 justify-end">
            <Button className="flex gap-2" onClick={addPeriod}>
              <Plus className="size-5" />
              Add
            </Button>
            <Button className="flex gap-2" onClick={saveTimeTable}>
              <Save className="size-5" />
              Save
            </Button>
          </div>
        </>
      ) : (
        <div className="flex justify-between w-full mt-6">
          {Object.keys(timeTable).map((key) => {
            return (
              <div key={key} className="w-full">
                <h1 className="p-4 bg-white mb-3 text-center text-xl font-medium">
                  {key}
                </h1>
                {timeTable[key] &&
                  timeTable[key].map((subject) => {
                    return (
                      <Card key={key}>
                        <CardHeader>
                          <CardTitle>{subject.subjectName}</CardTitle>
                          <CardDescription>
                            {subject.teacherName}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-2 items-center text-lg">
                          <Clock10 className="size-6" /> {subject.timeFrom} -{" "}
                          {subject.timeTo}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimeTable;
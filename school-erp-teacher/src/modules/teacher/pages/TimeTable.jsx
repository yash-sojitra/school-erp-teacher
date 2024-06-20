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
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../../../../node_modules/react-big-calendar/lib/sass/styles.scss";
import { dateTimeFormatter } from "../utils/dateFormatter";

const localizer = momentLocalizer(moment);

const daysofWeek = [
  "sunday",
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
  sunday:[],
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
  const [dayTable, setDayTable] = useState([]);
  const [date, setDate] = useState(new Date());

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
        response.data.timeTable[0].sunday=[];
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
      console.log(response);
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

  async function dayTimeTable() {
    let day = daysofWeek[date.getDay()];
    console.log("hiiiiiii");
    if (day == "sunday") {
      console.log("holiday");
    } else {
      console.log("timetable",timeTable[daysofWeek[date.getDay()]]);
      let todayTimeTable = [];
      timeTable[daysofWeek[date.getDay()]].forEach((period) => {
        todayTimeTable.push({
          title: period.subjectName,
          start: dateTimeFormatter(date, period.timeFrom),
          end: dateTimeFormatter(date, period.timeTo),
        });
      });
      setDayTable(todayTimeTable);
    }
  }

  useEffect(() => {
    setError(false);
    fetchTimeTable();
    fetchDept();
    fetchAllTeachers();
  }, []);

  useEffect(() => {
    dayTimeTable();
  }, [date, timeTable]);

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
                      {/* bug */}
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


        <div className="w-full mt-6">
      {!error ? (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal mb-6",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <ShadCalendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="w-full">
            <Calendar
              localizer={localizer}
              events={dayTable}
              date={date}
              defaultView="day"
              startAccessor="start"
              endAccessor="end"
              toolbar={false}
              min={dateTimeFormatter(date,'6:00')}
              max={dateTimeFormatter(date,"19:00")}
              />
          </div>
        </>
      ) : (
        <div className="text-xl font-bold text-red-600">{error}</div>
      )}
    </div>


      )}
    </div>
  );
};

export default TimeTable;

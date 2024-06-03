import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { useContext, useEffect, useState } from "react";
import { schedule } from "@/assets/data.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { AuthContext } from "@/auth/context/AuthContext";
import { getTodaysDay } from "../../utils/dateFormatter";

const classType = ["class lecture", "meeting", "training"];

const Schedule = () => {
  const { data } = useContext(AuthContext);
  const [selected, setSelected] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [error, setError] = useState(false);

  async function fetchSchedule() {
    try {
      const response = await axios.get(
        `https://erp-system-backend.onrender.com/api/v1/timeTable/teacher-schedule/${
          data.id
        }/${getTodaysDay().toLowerCase()}`
      );
      console.log(response.data.timetable);
      setFinalData(response.data.timetable);
    } catch (err) {
      console.log(err.response.status);
      if (err.response.status) {
        setError("no schedule today");
      }
    }
  }

  useEffect(() => {
    setError(false);
    const temp = schedule.filter((item) => {
      selected.includes(item.type);
    });
    setFinalData(temp);
    if (finalData.length == 0) {
      setFinalData(schedule);
    }
    // console.log(selected);
    // console.log(finalData);

    // console.log(selected);
    fetchSchedule();
  }, [selected.length]);

  return (
    <div className="py-6">
      <div className="options">
        {classType.map((item) => {
          return (
            <Toggle
              key={item}
              variant="outline"
              className="text-lg mx-2 rounded-full hover:bg-primary"
              onPressedChange={(pressed) => {
                if (pressed) {
                  selected.push(`${item}`);
                  setSelected(selected);
                } else {
                  selected.pop(`${item}`);
                  setSelected(selected);
                }
                // console.log(selected);
              }}
            >
              {item}
            </Toggle>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  gap-4 py-6">
        {error ? (
          <div className="font-bold text-2xl text-red-600">{error}</div>
        ) : (
          finalData.map((data) => {
            // console.log(data);
            return (
              <Card className="rounded-xl border-none shadow-md">
                <CardHeader>
                  <CardTitle>{data.subjectName}</CardTitle>
                  <CardDescription>{data.teacherName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Time: {data.timeFrom} - {data.timeTo}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Schedule;

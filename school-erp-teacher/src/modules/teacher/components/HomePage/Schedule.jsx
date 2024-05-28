import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import { schedule } from "@/assets/data.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Schedule = () => {
  const classType = ["class lecture", "meeting", "training"];
  const [selected, setSelected] = useState([]);
  const [finalData,setFinalData] = useState(schedule);
  useEffect(()=>{
    const temp = schedule.filter((item) => {selected.includes(item.type)})
    setFinalData(temp);
    if (finalData.length == 0) {
      setFinalData(schedule);
    }
    // console.log(selected);
    // console.log(finalData);

    // console.log(selected);

  },[selected.length])

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
        {schedule.map((data) => {
          // console.log(data);
          return <Block key={data.id} data={data} />;
        })}
      </div>
    </div>
  );
};

const Block = ({data}) => {
  return (
    <Card className="rounded-xl border-none shadow-md">
      <CardHeader>
        <CardTitle>{data.subject}</CardTitle>
        <CardDescription>{data.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Class: {data.class} | Time: {data.time}</p>
      </CardContent>
      <CardFooter>
        <Badge>{data.mode}</Badge>
      </CardFooter>
    </Card>
  );
};

export default Schedule;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { getTodaysDate, getTodaysDay } from "../../utils/dateFormatter";
import { students } from "@/assets/data.json";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Attendance = () => {
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    if(checked){
      checkedItems.push(id);
    }
    else{
      checkedItems.pop(id);
    }
    setCheckedItems(checkedItems);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Checked items:", checkedItems);
    // Process the checkedItems as needed
  };

  return (
    <>
      <h1 className="text-3xl font-bold pt-4">Student Attendance</h1>
        <p className="font-medium py-3">
          {getTodaysDate() + ", " + getTodaysDay()}
        </p>

      {/* <form onSubmit={handleSubmit}>
        {students.map((student) => {
          return <Student key={student.id} student={student} />;
        })}
      </form> */}
      <form onSubmit={handleSubmit}>
        {students.map((student) => (
          <div key={student.id} className="flex gap-6 items-center w-full bg-white rounded-xl my-4 p-4 shadow-md">
            <input
              type="checkbox"
              name={student.name}
              id={student.id}
              checked={!!checkedItems[student.name]}
              onChange={handleCheckboxChange}
            />
            <Avatar className="size-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="text-xl font-medium">{student.name}</h1>
          </div>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};

// const Student = ({ student }) => {
//   return (

//   );
// };

export default Attendance;

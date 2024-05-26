import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";

const Profile = () => {
  const [studentData, setStudentData] = useState({});
  const [error, setError] = useState(0);

  useEffect(() => {
    async function fetchData(id) {
      try {
        const response = await axios.get(
          `https://erp-system-backend.onrender.com/api/v1/student/1/fetch/${id}`
        );
        setError(0);
        setStudentData(response.data.data);
      } catch (error) {
        console.log(error);
        setError(1);
      }
    }
    fetchData(5);
  }, []);

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant="">View Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
            <div key={studentData.id} className="flex justify-between py-6">
              <div className="flex gap-6">
                  <Avatar className="size-20">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                      <p className="text-lg font-bold text-nowrap">{studentData.name}</p>
                      <p className="text-lg font-bold text-nowrap pb-1">Class: {studentData.departmentId}</p>
                      <div className="flex gap-4"><Phone/><Mail/></div>
                  </div>
              </div>
              <div className="font-medium">
                <p>Enrollment Id: <span className="text-primary-foreground">{studentData.rollNo}</span></p>
                <p>Academic Year: <span className="text-primary-foreground">2023-24</span></p>
                <p>Father Name: <span className="text-primary-foreground">{studentData.fatherName}</span></p>
                <p>Mother Name: <span className="text-primary-foreground">{studentData.motherName}</span></p>
                <p>Contact no: <span className="text-primary-foreground">{studentData.contactNumber}</span></p>
              </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Profile;

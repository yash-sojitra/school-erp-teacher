import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Attendance from "../components/classroom/Attendance";
import Students from "../components/classroom/Students";

const ClassRoom = () => {
  return (
      <Tabs
        defaultValue="account"
        className="w-full flex flex-col mx-6 md:mr-0"
      >
        <TabsList className="bg-primary justify-evenly p-6">
          <TabsTrigger className="text-2xl" value="attendance">
            Manage Attendance
          </TabsTrigger>
          {/* <TabsTrigger className="text-2xl" value="assignment">Assignemt</TabsTrigger> */}
          <TabsTrigger className="text-2xl" value="profile">
            Student Profile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <Attendance />
        </TabsContent>
        <TabsContent value="profile">
          <Students/>
        </TabsContent>
      </Tabs>
  );
};

export default ClassRoom;

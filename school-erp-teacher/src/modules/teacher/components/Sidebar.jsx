import { AuthContext } from "@/auth/context/AuthContext";
import { BadgeIndianRupee, CalendarClock, GraduationCap, Info, LayoutDashboard, Library, LibraryBig, LogOut, MessageCircleMore, Settings, Stamp } from "lucide-react";
import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Sidebar = ({ sidebar, boxRef }) => {
  const navigate = useNavigate();
  const { data, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!data) {
    return <div>User data is not available.</div>;
  }

  return (
    <div ref={boxRef} className={` sidebar z-[1] h-screen w-60 py-6 px-8 flex-col justify-between rounded-r-2xl shadow-xl bg-white ${sidebar ? 'flex absolute z-[1]' : 'hidden'} flex absolute z-[1] lg:flex lg:sticky lg:top-0 `}>
      <div>
        <div></div>
        <div className="text-4xl font-bold py-4">logo</div>
        <ul className="text-lg font-semibold">
          <li><Link to='/' className="flex gap-4 my-6 items-center"><LayoutDashboard /> Dashboard</Link></li>
          <li><Link to='/class' className="flex gap-4 my-6 items-center"><GraduationCap />Class Room</Link></li>
          <li><Link to='/leave' className="flex gap-4 my-6 items-center"><Stamp /> Leave</Link></li>
          <li><Link to='/library' className="flex gap-4 my-6 items-center"><Library /> Library</Link></li>
          {data.AdditionalRole === "class teacher" &&
            <li><Link to='/timeTable' className="flex gap-4 my-6 items-center"><Library /> Time Table</Link></li>
          }
          <li><Link to='/support' className="flex gap-4 my-6 items-center"><Info /> Support</Link></li>
        </ul>
      </div>
      <div>
        <ul className='text-lg font-semibold'>
          <li className="flex gap-4 my-6 items-center"><Settings /> Settings</li>
          <li className="flex gap-4 my-6 items-center cursor-pointer">
            <Dialog>
              <DialogTrigger className="flex gap-4 my-6 items-center cursor-pointer"><LogOut /> Logout</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to log out of the platform!
                  </DialogDescription>
                </DialogHeader>
                <Button onClick={handleLogout}>Logout</Button>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

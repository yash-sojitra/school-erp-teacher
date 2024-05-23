import { AuthContext } from "@/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const {login} = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    setError(false);
  }, [])
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData).then((res)=>{
      // console.log(res);
      if (res.success == true) {
        setError(false);
        navigate("/");
      }
      else{
        setError(res.message);
      }
    });
  }

  return (
    <div className="flex w-full h-full items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Student Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} >
          <CardContent>
            {error && <div>{error}</div>}
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
                <Input id="password" type="password" name="password" value={formData.password} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" value="Submit">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;

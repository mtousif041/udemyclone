// ye pura component shad cn se utaya hai
//npx shadcn@latest add tabs
//npx shadcn@latest add card
//npx shadcn@latest add input label
//ya ek satth bhi kr shakte ho
//npx shadcn@latest add input label tabs card

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  // sirf isko edit kiya ***************************

  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  // ye dono mutation authApi.js se aarhe hai
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
    // { data, isLoading, error, isSuccess } ye haina rtk query ki predefined properties hoti hai jo rtk-query ke hooks automatically return krte hai , tum ine directly destructre kr shakte ho, aur tum inka custame naming bhi kr shakte data:courseData, isLoading:courseIsLoading,...
    // {
    //   data,
    //   error,
    //   isLoading,
    //   isSuccess,
    // }, //aap inko aise bhi likh shakte ho lekin registerUser aur loginUser me name same hone ki vajaha se error line aane lag jaati hai isliye isko aise likha hai
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();
  // { data, isLoading, error, isSuccess } ye haina rtk query ki predefined properties hoti hai jo rtk-query ke hooks automatically return krte hai , tum ine directly destructre kr shakte ho, aur tum inka custame naming bhi kr shakte data:courseData, isLoading:courseIsLoading,...
  const navigate = useNavigate();

  // ab jo bhi hmare input hai unme se data ko gaate krna hai // hum yha signup aur login dono ke liye ek hi function bnaynge
  const changeInputHandler = (e, type) => {
    // yha pr hum event ke saath saath type bhi bhejenge
    // console.log(e.target.type);
    // console.log(e.target.name);
    // console.log(e.target.value);
    // console.log(e.target.placeholder);
    // console.log(e.target.required);
    // console.log("test");
    // alert(e)

    const { name, value } = e.target;

    // ab yha ek checkup lgaunga ki agr vo signup hai to signup me set krna hai agr login hai to login me set krna hai
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  //ab data ko get krne ke liye ek function bnaynge jese koi click krega apne ko data yha pr mil jaayega
  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    // console.log(inputData);

    // jese hi ye function call hoga to me ye mutation ko call karunga thaki hmara  api call ho jaaye
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData); // yaani yha pr hum registerUser() ya loginUser() ko call krenge
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful.");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Signup Failed");
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful.");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data.message || "Login Failed");
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);

  return (
    <div className="flex items-center w-full justify-center  mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="eg. Mohammed Tousif"
                  required="true"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="eg.tousif@mail.com"
                  required="true"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Password"
                  required="true"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin">
                      Please wait...
                    </Loader2>
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="eg.tousif@mail.com"
                  required="true"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Password"
                  required="true"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={loginIsLoading}
                onClick={() => handleRegistration("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin">
                      Please wait...
                    </Loader2>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;

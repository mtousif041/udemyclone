import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  // jab query hoti to hum {} ka use krte hai , aur jab mutation hota hai to hum [] ka use krte hai
  const { data, isLoading, refetch } = useLoadUserQuery(); //query  hai ye, aur refetch ek function hota hai yaani kab kab useLoadUserQuery ko fetch krna hai// ye data vahi data hai jo hum backend se response me bhej rahe hai 
  // console.log(data);
  // const [updateUser, {data, isLoading, error}] = useUpdateUserMutation(); //mutation ha ye , ye aur uper ka data,data  isLoading,isLoading dono match ho rha hai to iska name change krlenge , like data:updateUserData
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    // ye simply api integration ho gya yha pr mere ko axios vgera nhai use krna pd rha hai
    // console.log(name, profilePhoto);
    const formData = new FormData(); // jab bhi tum file bhejte ho to form data apne ko lena padta hai
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);

    //ab hum updateUser mutation ko call krne wale hai
    await updateUser(formData);
  }; // ye simply api integration ho gya yha pr mere ko axios vgera nhai use krna pd rha hai

  useEffect(() => {
    refetch(); // refetch, i think rtk qury ka hi ek function hota hai  data refetch krne ke liye 
  }, []);

  //ab mere ko message bhi display krna hai jab vo update ho jaayega
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile Updated");
    }

    if (isError) {
      toast.error(error.message || "Failed to update Profile");
    }
  }, [error, isSuccess, isError]);

  if (isLoading) return <h1>Profile Loading...</h1>;

  // ab jo uper data aarha hai usme se hum user ko destructure kr lenge, aur fir user ko niche use kr lenge
  const user = data && data.user;
  // const {user} = data;

  return (
    <div className="my-10 max-w-4xl mx-auto px-4 ">
      <h1 className="font-bold text-2xl text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center ">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2 ">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.name}
              </span>
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email}
              </span>
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you are
                  done .
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    className="col-span-3"
                    accept="image/*"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please Wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses You're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user.enrolledCourses.length === 0 ? (
            <h1>You haven't enrolled yet</h1>
          ) : (
            user.enrolledCourses.map((course, index) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

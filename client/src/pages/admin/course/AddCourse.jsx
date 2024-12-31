import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  // input field ke ander jo bhi text hoga usko get krenge
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  //mutation ko lekr aao courseApi.js se
  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation(); // { data, isLoading, error, isSuccess } ye haina rtk query ki predefined properties hoti hai jo rtk-query ke hooks automatically return krte hai , tum ine directly destructre kr shakte ho, aur tum inka custame naming bhi kr shakte data:courseData, isLoading:courseIsLoading,...

  const navigate = useNavigate();
  // const isLoading = false;

  // yha pr jo bhi meri get selected catogory hogi usko get krunga
  const getSelectedCategory = (value) => {
    // alert(value);
    setCategory(value);
  };

  const createCourseHandler = async () => {
    // alert("working");
    // console.log(courseTitle, category);
    await createCourse({ courseTitle, category }); // yha se hum courseTitle category ko courseApi.js me bhejte hai
  };

  // useEffect for displaying message/toast
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Created"); // data.message ye backend se aarha hai jo bhi hum response ko return kr rhe hai
      navigate("/admin/course");
    }
  }, [isSuccess, error]);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add course, add some basic course details for your new course
        </h1>
        <p className="text-sm">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod,
          magnam?
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            // name="courseTitle" //isko hta bhi shakte ho
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your course Name"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next Js">Next Js</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Frontend Devlopement">
                  Frontend Devlopement
                </SelectItem>
                <SelectItem value="Fullstack Devlopemen">
                  Fullstack Devlopement
                </SelectItem>
                <SelectItem value="Mern Stack Devlopement">
                  Mern Stack Devlopement
                </SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="MongoDb">MongoDb</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 ">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait..
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;

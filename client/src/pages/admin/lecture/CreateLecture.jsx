import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  

  const [createLecture, { data, isLoading, error, isSuccess }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch, // ye 101
  } = useGetCourseLectureQuery(courseId);

  // iska bhi rtk qury bna lenge courseApi.js me
  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId }); // yha se hum lectureTitle courseId ko courseApi.js me bhejte hai
  };

  useEffect(() => {
    if (isSuccess) {
      refetch(); //aur ye 101 se kiya hoga ki jab bhi jese hi lecture create krenge vo fir se refetch ho jaayega
      toast.success(data.message);
    }

    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  //   console.log(lectureData);

  return (
    <div className="flex-1 mx-10 ">
      <div className="mb-4 ">
        <h1 className="font-bold text-xl">
          Lets add Lecture, add some basic details for your new lecture.
        </h1>
        <p className="text-sm">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod,
          magnam?
        </p>
      </div>
      <div className="space-y-4 ">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title Name"
          />
        </div>

        <div className="flex items-center gap-2 ">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait..
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
        <div className="mt-10 ">
          {lectureLoading ? (
            <p>Loading lectures...</p>
          ) : lectureError ? (
            <p>Failed to load lectures</p>
          ) : lectureData.lectures.length === 0 ? (
            <p>No Lecture Available</p>
          ) : (
            lectureData.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                index={index}
                courseId={courseId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
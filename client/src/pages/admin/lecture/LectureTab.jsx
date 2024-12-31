import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");

  // jab me video ko upload krdunga to uske saath saath mere ko ek response milega us response ko store krne ke liye bhi hum yha pr ek  state variable bna lenge
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);

  // ab jab video upload ho rhai ho to uski uploading ko dhikane ke liye ek media progressbar chaye
  const [mediaProgress, setMediaProgress] = useState(false);

  //iske ander vo value rhakenge ki kitna % upload ho chuka hai
  const [uploadProgress, setUploadProgress] = useState(0);

  const [btnDisable, setBtnDisable] = useState(true); // ye false tab hi hoga jab tum video ko complete upload kr chke hoge
  const params = useParams();
  const { courseId, lectureId } = params;

  //use query
  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  //apne ko lectureData mese lecture milega usko hum populate krenge
  const lecture = lectureData?.lecture; // isse humko lecture mil jaayega

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  //use mutation
  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  // use mutation
  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    //is function ke liye me koi rtk query use nhai karunga knyuki ye basic sa hai api call lagne wala hai isme
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      setMediaProgress(true); //yaani yha se ye progress hona start ho jaayega 
      //ab api call krne wale hai
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          // yha pr jitna upload ho jaaye uske liye ek progress dhikaha hai
          onUploadProgress: ({ loaded, total }) => {
            //ye prebuild hi milta hai
            setUploadProgress(Math.round((loaded * 100) / total)); // ye mere ko generate krke de dega ki kitna % upload hua hai
          },
        });

        if (res.data.success) {
          // console.log(res);
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("video upload failed");
      } finally {
        setMediaProgress(false); // yaani ab ye progressbar band hoga agr success hota hai tab bhi aur failed hota hai tab bhi
      }
    }
  };

  const editLectureHandler = async () => {
    // alert("working");
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);  
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
    }
  }, [removeSuccess]);
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={removeLectureHandler}
            disabled={removeLoading}
          >
            {removeLoading ? (
              <>
                {" "}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait...
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to javascript"
          />
        </div>
        <div className="my-5">
          <Label>
            Video <span className="text-red-500 ">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={isFree}
            onCheckedChange={setIsFree}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        {/* for progress bar */}
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-4">
          <Button disabled={isLoading} onClick={editLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait...
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;

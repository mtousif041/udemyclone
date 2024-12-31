import multer from "multer";

const upload = multer({dest:"uploads/"}); //dest means ki kha pr upload krna hai , uploads naam ka server me ek folder ban jaayega 

export default upload;

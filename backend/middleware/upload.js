import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req,file,cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if(allowedMimes.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(new Error(`Invalid file type. Got: ${file.mimetype}`));
    }
  }
});


export const uploadToCloudinary = async (file) => {
  const buffer = Buffer.isBuffer(file.buffer)
    ? file.buffer
    : Buffer.from(file.buffer);

  const dataUri = `data:${file.mimetype};base64,${buffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'recipe-app',
    transformation: [{ width: 1000, crop: 'limit' }],
  });

  return result;
};
export default upload;
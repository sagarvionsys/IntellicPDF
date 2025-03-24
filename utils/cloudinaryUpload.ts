"use server";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  uniqueFileName: string;
};

const cloudinaryUpload = async (
  base64File: string,
  userId: string
): Promise<CloudinaryUploadResult> => {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uniqueFileName = `file_${uuidv4()}`;

    cloudinary.uploader.upload(
      base64File,
      {
        resource_type: "auto",
        folder: `user_${userId}`,
        public_id: uniqueFileName,
        use_filename: false,
        overwrite: false,
      },
      (error: any, result: any) => {
        if (error) {
          console.log(error);
          return reject("Error while uploading file to Cloudinary");
        }
        console.log("File uploaded successfully!");

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          uniqueFileName: uniqueFileName,
        });
      }
    );
  });
};

export default cloudinaryUpload;

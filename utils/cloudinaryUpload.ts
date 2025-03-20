"use server";

import cloudinary from "@/lib/cloudinary";

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

const cloudinaryUpload = async (
  base64File: string,
  userId: string
): Promise<CloudinaryUploadResult> => {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    console.log("image is uploading.............");
    cloudinary.uploader.upload(
      base64File,
      {
        resource_type: "image",
        folder: `user_${userId}`,
      },

      (error: any, result: any) => {
        if (error) {
          console.log(error);

          return reject("Error while uploading image to Cloudinary");
        }
        console.log("image is uploaded.............");
        resolve(result as CloudinaryUploadResult);
      }
    );
  });
};

export default cloudinaryUpload;

import { metadata } from "@/app/layout";
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  petImages: f({
    image: { maxFileSize: "16MB", maxFileCount: 10 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete");
    console.log("File URL:", file.ufsUrl);
    // console.log("Uploaded by user:", metadata.userId);

    return { uploadedBy: metadata.userId };
  }),
};

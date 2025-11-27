import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2";

const BUCKET = process.env.R2_BUCKET_NAME!;

/* ----------------------------------------------
   UPLOAD PDF TO R2
---------------------------------------------- */
export const uploadPDFToR2 = async (file: Express.Multer.File) => {
  const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
  const key = `quotations/${Date.now()}-${sanitizedName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: "application/pdf",
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
};

/* ----------------------------------------------
   DELETE FILE FROM R2
   (Supports both public URL formats)
---------------------------------------------- */
export const deleteFromR2 = async (fileUrl: string) => {
  if (!fileUrl) return;

  try {
    let key: string | undefined;

    // Format A → https://pub-xxx.r2.dev/BUCKET/key
    if (fileUrl.includes(".r2.dev/")) {
      key = fileUrl.split(".r2.dev/")[1];
    }

    // Format B → https://<account>.r2.cloudflarestorage.com/BUCKET/key
    if (!key && fileUrl.includes(".r2.cloudflarestorage.com/")) {
      key = fileUrl.split(".r2.cloudflarestorage.com/")[1];
    }

    if (!key) {
      console.error("Could not extract R2 key from URL:", fileUrl);
      return;
    }

    // Remove bucket prefix if present
    if (key.startsWith(`${BUCKET}/`)) {
      key = key.replace(`${BUCKET}/`, "");
    }

    await r2.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );

  } catch (err) {
    console.error("Failed to delete R2 file:", err);
  }
};
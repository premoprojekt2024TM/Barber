import AWS from "aws-sdk";
import * as dotenv from "dotenv";
dotenv.config();

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  endpoint: process.env.AWS_S3_ENDPOINT!,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

export const uploadStoreImage = async (
  base64Image: string,
  filename: string,
  contentType: string,
): Promise<string> => {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const folderPath = "Uploads/Store/";
  const filePath = `${folderPath}${Date.now()}-${filename}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(params).promise();
    return `https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/${filePath}`;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Image upload failed");
  }
};

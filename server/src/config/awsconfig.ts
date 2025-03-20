import AWS from "aws-sdk";
import * as dotenv from "dotenv";

dotenv.config();
export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (!BUCKET_NAME) {
  throw new Error(
    "AWS_BUCKET_NAME nincs definiálva",
  );
}

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
    Bucket: BUCKET_NAME!,
    Key: filePath,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    throw new Error("Image upload failed");
  }
};

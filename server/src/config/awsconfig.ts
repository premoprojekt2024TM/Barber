import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  S3,
} from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
dotenv.config();

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
export const S3_BASE_URL = process.env.AWS_S3_BASE_URL!;

if (!BUCKET_NAME || !S3_BASE_URL) {
  throw new Error(
    "BUCKET_NAME vagy S3_BASE_URL nincs deklarálva a környezeti változoban",
  );
}

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export const uploadStoreImage = async (
  base64Image: string,
  filename: string,
  contentType: string,
): Promise<string> => {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const folderPath = "Uploads/Store/";
  const filePath = `${folderPath}${Date.now()}-${filename}`;
  const putObjectParams = {
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read" as ObjectCannedACL,
  };

  try {
    const command = new PutObjectCommand(putObjectParams);
    await s3Client.send(command);
    return `${S3_BASE_URL}${filePath}`;
  } catch (error) {
    throw new Error("Sikertelen képfeltöltés");
  }
};

export const uploadProfilePicture = async (
  base64Image: string,
  filename: string,
  contentType: string,
): Promise<string> => {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const folderPath = "Uploads/ProfilePhotos/";
  const filePath = `${folderPath}${Date.now()}-${filename}`;
  const putObjectParams = {
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read" as ObjectCannedACL,
  };

  try {
    const command = new PutObjectCommand(putObjectParams);
    await s3Client.send(command);
    return `${S3_BASE_URL}${filePath}`;
  } catch (error) {
    throw new Error("Sikertelen profilkép feltöltés");
  }
};

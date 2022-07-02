import AWS from "aws-sdk";
import "dotenv/config";

const s3 = new AWS.S3();

export default async function uploadFileToS3(file) {
  const uploaedFile = await s3
    .upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.mimetype,
    })
    .promise();

  return uploaedFile;
}

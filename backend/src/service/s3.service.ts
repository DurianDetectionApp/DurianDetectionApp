import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { env } from "../config/env";

function getExtension(filename: string, mimeType: string): string {
  if (filename && filename.includes(".")) {
    const ext = filename.split(".").pop();
    if (ext) return `.${ext}`;
  }
  if (mimeType.includes("webm")) return ".webm";
  if (mimeType.includes("wav")) return ".wav";
  if (mimeType.includes("mp3")) return ".mp3";
  if (
    mimeType.includes("mp4") ||
    mimeType.includes("m4a") ||
    mimeType.includes("aac")
  ) {
    return ".m4a";
  }
  return ".m4a";
}

let s3Client: S3Client | null = null;

function getS3Client(): S3Client | null {
  if (s3Client) return s3Client;

  if (
    !env.awsAccessKeyId ||
    !env.awsSecretAccessKey ||
    !env.awsRegion ||
    !env.awsS3Bucket
  ) {
    return null;
  }

  s3Client = new S3Client({
    region: env.awsRegion,
    credentials: {
      accessKeyId: env.awsAccessKeyId,
      secretAccessKey: env.awsSecretAccessKey,
    },
  });
  return s3Client;
}

export async function uploadAudioToS3(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string | undefined> {
  const client = getS3Client();
  if (!client) {
    // eslint-disable-next-line no-console
    console.warn(
      "[s3-service] AWS S3 is not fully configured (missing key, secret, region or bucket). Skipping upload.",
    );
    return undefined;
  }

  const ext = getExtension(originalName, mimeType);
  const fileKey = `uploads/audio-${Date.now()}-${crypto.randomUUID()}${ext}`;

  try {
    const command = new PutObjectCommand({
      Bucket: env.awsS3Bucket,
      Key: fileKey,
      Body: buffer,
      ContentType: mimeType || "audio/m4a",
    });

    await client.send(command);

    const url = `https://${env.awsS3Bucket}.s3.${env.awsRegion}.amazonaws.com/${fileKey}`;
    // eslint-disable-next-line no-console
    console.log(`[s3-service] Successfully uploaded audio to S3: ${url}`);
    return url;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[s3-service] Failed to upload audio to S3:", error);
    return undefined;
  }
}

import { env } from "@/lib/env";
import type { ContentType } from "@/types";
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
	region: env.AWS_REGION || "sa-east-1",
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY || "",
	},
});

export const getS3Url = (type: ContentType, key: string): string => {
	return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${type}/${key}`;
};

export const uploadToS3 = async (
	key: string,
	file: Buffer,
	contentType?: string,
): Promise<string> => {
	try {
		console.log("Uploading to S3:", {
			key,
			contentType,
			fileSize: file.length,
			bucket: env.AWS_S3_BUCKET,
			region: env.AWS_REGION,
			hasAccessKey: !!env.AWS_ACCESS_KEY_ID,
			hasSecretKey: !!env.AWS_SECRET_ACCESS_KEY,
		});

		if (!env.AWS_S3_BUCKET) {
			throw new Error("AWS_S3_BUCKET environment variable is not configured");
		}

		if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
			throw new Error("AWS credentials are not configured");
		}

		const command = new PutObjectCommand({
			Bucket: env.AWS_S3_BUCKET,
			Key: key,
			Body: file,
			ContentType: contentType || "application/octet-stream",
			ACL: "public-read",
			ServerSideEncryption: "AES256",
		});

		const result = await s3Client.send(command);
		console.log("Successfully uploaded to S3:", { key, etag: result.ETag });
		return key;
	} catch (error) {
		console.error("S3 upload error:", error);

		// Provide more specific error messages
		if (error instanceof Error) {
			if (error.message.includes("AccessDenied")) {
				throw new Error(
					"AWS Access Denied: Check your AWS credentials and bucket permissions",
				);
			}
			if (error.message.includes("NoSuchBucket")) {
				throw new Error(`AWS bucket '${env.AWS_S3_BUCKET}' does not exist`);
			}
			if (error.message.includes("InvalidAccessKeyId")) {
				throw new Error("Invalid AWS Access Key ID");
			}
			if (error.message.includes("SignatureDoesNotMatch")) {
				throw new Error("Invalid AWS Secret Access Key");
			}
		}

		throw new Error(
			`Failed to upload file to S3: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
};

export const deleteFromS3 = async (key: string): Promise<void> => {
	const command = new DeleteObjectCommand({
		Bucket: env.AWS_S3_BUCKET,
		Key: key,
	});

	await s3Client.send(command);
};

export const generatePresignedUploadUrl = async (
	key: string,
	contentType: string,
	expiresIn: number = 3600,
): Promise<string> => {
	const command = new PutObjectCommand({
		Bucket: env.AWS_S3_BUCKET,
		Key: key,
		ContentType: contentType,
	});

	return getSignedUrl(s3Client, command, { expiresIn });
};

export const generatePresignedDownloadUrl = async (
	key: string,
	expiresIn: number = 3600,
): Promise<string> => {
	const command = new GetObjectCommand({
		Bucket: env.AWS_S3_BUCKET,
		Key: key,
	});

	return getSignedUrl(s3Client, command);
};

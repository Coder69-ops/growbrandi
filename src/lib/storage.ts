import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// R2 Configuration
const R2_ACCOUNT_ID = import.meta.env.VITE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME || 'growbrandi';
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://media.growbrandi.com';

// Initialize S3 Client for R2
const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

export const storage = {
    /**
     * Uploads a file to Cloudflare R2
     * @param file The file object to upload
     * @param folder The folder path (optional)
     * @returns The public URL of the uploaded file
     */
    uploadFile: async (file: File, folder: string = 'uploads'): Promise<string> => {
        try {
            // Create a unique file name
            const timestamp = Date.now();
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
            const key = `${folder}/${timestamp}-${cleanFileName}`;

            // Upload parameters
            // Convert File to Uint8Array to avoid "readableStream.getReader is not a function" error
            const arrayBuffer = await file.arrayBuffer();
            const body = new Uint8Array(arrayBuffer);

            // Upload parameters
            const command = new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                Body: body,
                ContentType: file.type,
                // ACL: 'public-read', // R2 doesn't stickly support ACLs the same way, public access is bucket-level or via custom domain
            });

            // Execute upload
            await s3Client.send(command);

            // Return public URL
            // If using custom domain: https://media.growbrandi.com/folder/filename
            return `${R2_PUBLIC_URL}/${key}`;
        } catch (error) {
            console.error('Error uploading to R2:', error);
            throw new Error('Failed to upload file to Cloudflare R2');
        }
    },

    /**
     * Deletes a file from Cloudflare R2
     * @param fileUrl The full public URL of the file to delete
     */
    deleteFile: async (fileUrl: string): Promise<void> => {
        try {
            // Extract key from URL
            // URL format: https://media.growbrandi.com/uploads/filename
            // or https://....r2.cloudflarestorage.com/options/uploads/filename

            let key = '';
            if (fileUrl.startsWith(R2_PUBLIC_URL)) {
                key = fileUrl.replace(`${R2_PUBLIC_URL}/`, '');
            } else {
                // Fallback extraction if URL format is different
                const url = new URL(fileUrl);
                key = url.pathname.substring(1); // Remove leading slash
            }

            if (!key) return;

            const command = new DeleteObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
            });

            await s3Client.send(command);
        } catch (error) {
            console.error('Error deleting from R2:', error);
            // We usually don't want to block UI on delete failure, so just log it
        }
    }
};

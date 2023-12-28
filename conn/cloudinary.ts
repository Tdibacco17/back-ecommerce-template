import { v2 as cloudinary } from 'cloudinary';
import { environment } from '../utils/config';
import { CloudinaryImgInterface } from '../types';

cloudinary.config({
    cloud_name: environment.CLOUDINARY_CLOUD_NAME,
    api_key: environment.CLOUDINARY_API_KEY,
    api_secret: environment.CLOUDINARY_API_SECRET
});

export async function uploadImage(filePath: string) {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: "ecommerce-template",
    });
    return {
        public_id: result.public_id,
        secure_url: result.secure_url,
    } as CloudinaryImgInterface;
}

export async function uploadMultipleImages(filePaths: string[]) {
    const uploadResults = await Promise.all(
        filePaths.map(uploadImage)
    );

    return uploadResults;
}

export async function deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId)
}
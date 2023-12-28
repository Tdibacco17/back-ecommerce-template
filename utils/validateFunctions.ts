import { UploadedFile } from 'express-fileupload';
import { uploadImage, uploadMultipleImages } from '../conn/cloudinary';
import { CloudinaryImgInterface } from '../types';

export const isValidCategories = (categories: string[]/* CategoriesFilterInterface[] */): boolean => {
    const allowedCategories = ["all", "tshirt", "sweatshirts", "top", "sportswear", "bottoms", "dresses", "outstanding"];
    return categories.every(category => allowedCategories.includes(category));
}

export async function handleImageUpload(image: UploadedFile | undefined, images: UploadedFile | UploadedFile[] | undefined) {
    const cloudImageData = image ? await uploadImage(image.tempFilePath) : undefined;

    let cloudImagesData: CloudinaryImgInterface[] = images
        ? Array.isArray(images) ?
            await uploadMultipleImages(images.map((img) => img.tempFilePath))
            : [await uploadImage((images as UploadedFile)?.tempFilePath)]
        : [];

    if (cloudImageData) {
        cloudImagesData = [cloudImageData, ...cloudImagesData];
    }

    return { cloudImageData, cloudImagesData };
}
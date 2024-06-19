import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { ENV_CONS } from '../../constants/env.constant.js';

const s3 = new S3Client({
    credentials: {
        accessKeyId: ENV_CONS.AWS_ACCESS_KEY_ID,
        secretAccessKey: ENV_CONS.AWS_SECRET_ACCESS_KEY,
    },
    region: ENV_CONS.AWS_REGION,
});
export const upload = multer({
    storage: multerS3({
        s3,
        bucket: ENV_CONS.BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `reviews/${Date.now().toString()}-${file.originalname}`);
        },
    }),
});
export const uploadImages = (file) => {
    return new Promise((resolve, reject) => {
        const uploadHandler = upload.single('images');

        uploadHandler(file, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const urls = file.location;
                resolve(urls);
            }
        });
    });
};

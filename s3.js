const S3 = require('aws-sdk/clients/s3');
const { v4: uuidv4 } = require('uuid');
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});
const BUCKET = process.env.BUCKET;

exports.uploadToS3 = async ({ file, userId }) => {

    const key = `${userId}/${uuidv4()}`;
    const command = {
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    }
    try {
        await s3.putObject(command).promise();
        return { key };
    } catch (error) {
        console.log(error)
        return { error }
    }
}

exports.getImageKeys = async (userId) => {
    const command = {
        Bucket: BUCKET,
        prefix: userId
    }

    const { Contents = [] } = await s3.listObjectsV2(command).promise()

    return Contents.map((image) => image.Key)
}

exports.getUserPresignedUrls = async (userId) => {
    try {
        const imageKeys = await this.getImageKeys(userId)
        const presignedUrls = await Promise.all(imageKeys.map(key => {
            return s3.getSignedUrl(s3.getObject({ Bucket: BUCKET, Key: key }))
        }))
        return { presignedUrls }
    } catch (error) {
        console.log(error)
        return error.message

    }
}
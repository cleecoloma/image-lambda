import { S3 } from '@aws-sdk/client-s3'; // code preinstalled by AWS, to do S3 operations -> Reading and Writing

let s3 = new S3({ region: 'us-west-2' });

export const handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const key = 'images/images.json'; // Name of the JSON file in the bucket

  try {
    // Download the existing images.json file from S3 (if it exists)
    const existingImageData = await s3.getObject({
      Bucket: bucketName,
      Key: key,
    });

    // Parse the existing JSON data or create an empty array
    const existingImages =
      JSON.parse(await existingImageData.Body.transformToString()) || [];

    // Extract image metadata from the S3 event
    const imageMetadata = {
      name: event.Records[0].s3.object.key,
      size: event.Records[0].s3.object.size,
      type: event.Records[0].s3.object.contentType,
      // Add other metadata properties as needed
    };

    // Check if the image with the same name already exists
    const existingIndex = existingImages.findIndex(
      (image) => image.name === imageMetadata.name
    );

    if (existingIndex !== -1) {
      // If the image exists, update the existing object
      existingImages[existingIndex] = imageMetadata;
    } else {
      // If the image is not a duplicate, add it to the array
      existingImages.push(imageMetadata);
    }

    // Convert the updated array to JSON
    const updatedImageData = JSON.stringify(existingImages);

    // Upload the updated images.json back to the S3 bucket
    await s3.putObject({
      Bucket: bucketName,
      Key: key,
      Body: updatedImageData,
      ContentType: 'application/json',
    });
    // .promise();

    return {
      statusCode: 200,
      body: 'Image metadata updated successfully.',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'An error occurred.',
    };
  }
};

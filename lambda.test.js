import { handler } from './index.js'; // Adjust the path as needed
import { S3 } from '@aws-sdk/client-s3';
import { mocked } from 'jest-mock';
import { S3Client } from '@aws-sdk/client-s3/S3Client'; // This import may vary based on your AWS SDK version

jest.mock('@aws-sdk/client-s3');

describe('Lambda Function Test', () => {
  it('should handle the S3 event', async () => {
    // Mock the S3 methods
    const s3GetObjectMock = mocked(S3Client.prototype.send);
    const s3PutObjectMock = mocked(S3Client.prototype.send);

    // Set up mock data for getObject
    s3GetObjectMock.mockResolvedValue({
      Body: '[]', // Mock existing data
    });

    // Set up mock data for putObject
    s3PutObjectMock.mockResolvedValue({});

    // Define a sample S3 event
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'your-bucket-name',
            },
            object: {
              key: 'images/sample.jpg',
              size: 1024,
              contentType: 'image/jpeg',
            },
          },
        },
      ],
    };

    // Invoke the Lambda function
    const result = await handler(event);

    // Check the response from the Lambda function
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('Image metadata updated successfully.');

    // Verify that getObject and putObject were called
    expect(s3GetObjectMock).toHaveBeenCalledWith(
      expect.objectContaining({ Key: 'images/images.json' })
    );
    expect(s3PutObjectMock).toHaveBeenCalledWith(
      expect.objectContaining({ Key: 'images/images.json' })
    );
  });
});

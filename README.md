# Image Lambda
> This lambda function updates an images.json in s3bucket that gets triggered when image-lambda-storage/images folder gets updated. It pushes file name and file size.

## Link to images.json file
[Images.json](https://image-lambda-storage.s3.us-west-2.amazonaws.com/images/images.json#)

## Issues
> Some issues I ran into while working on this lab assignment:
1. Parsing the data that event gives me while uploading an image to the s3bucket was hard
2. I also read the s3 documentation to be able check the available methods.

## Contributors
* Chester Lee Coloma
* ChatGPT (help with function)
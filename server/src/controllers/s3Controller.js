const fs = require("fs")
const AWS = require("aws-sdk")

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: new AWS.Credentials({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  }),
})

const s3 = new AWS.S3()

exports.uploadImageToS3 = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded")
  }

  try {
    const fileContent = fs.readFileSync(req.file.path)
    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${req.file.originalname}`,
      Body: fileContent,
      ContentType: req.file.mimetype,
    }

    const data = await s3.upload(params).promise()
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Failed to delete the file:", err)
        return
      }
    })
    res.send({ url: data.Location })
  } catch (error) {
    console.error("Error uploading to S3:", error)
    const statusCode = error.statusCode || 500
    const message = error.message || "An unexpected error occurred"
    res.status(statusCode).send({ error: message })
  }
}

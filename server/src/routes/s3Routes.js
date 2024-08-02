const express = require("express")
const s3Controller = require("../controllers/s3Controller")
const multer = require("multer")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now())
  },
})

const upload = multer({ storage: storage })
const router = express.Router()

router.post("/upload", upload.single("file"), s3Controller.uploadImageToS3)

module.exports = router

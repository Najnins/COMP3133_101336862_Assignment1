const cloudinary = require("../config/cloudinary");
const { throwValidationError } = require("../utils/errors");

async function uploadBase64Image(base64, folder) {
  if (!base64) return "";

  // Expect: data:image/png;base64,xxxx OR just base64 string
  const looksLikeDataUrl = typeof base64 === "string" && base64.startsWith("data:image/");
  const payload = looksLikeDataUrl ? base64 : `data:image/png;base64,${base64}`;

  try {
    const res = await cloudinary.uploader.upload(payload, {
      folder: folder || process.env.CLOUDINARY_FOLDER || "employee_photos",
      resource_type: "image",
    });
    return res.secure_url;
  } catch (e) {
    throwValidationError("Image upload failed", [{ field: "employee_photo", message: e.message }]);
  }
}

module.exports = { uploadBase64Image };
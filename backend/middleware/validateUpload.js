const validateUpload = (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    next();
  };
  
  export default validateUpload;
  
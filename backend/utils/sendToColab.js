import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const sendToColab = async (imagePath) => {
  const formData = new FormData();
  formData.append("image", fs.createReadStream(imagePath));

  const response = await axios.post(process.env.COLAB_MODEL_URL, formData, {
    headers: formData.getHeaders()
  });

  return response.data;
};

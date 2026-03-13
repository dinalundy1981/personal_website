const IMGBB_API_KEY = "d95afc1fb33dacfaed586bce9adf411f";

export const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", IMGBB_API_KEY);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!json.success) throw new Error("ImgBB upload failed");
  return json.data.display_url;
};

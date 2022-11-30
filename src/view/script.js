var fileUpload;

document.getElementById("imageFace").addEventListener("change", (e) => {
  fileImage = e.target.files[0];
  const src = URL.createObjectURL(fileImage);
  document.getElementById("image").src = src;
});

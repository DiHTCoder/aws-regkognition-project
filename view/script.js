var fileName;

document.getElementById("image").addEventListener("change", (e) => {
    fileImage = e.target.files[0];
    const src = URL.createObjectURL(fileImage);
    document.getElementById("imageDisplay").src = src;
});

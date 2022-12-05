var fileImage;
var fileName;
document.getElementById("imageUp").addEventListener("change", (e) => {
    fileImage = e.target.files[0];
    const formData = new FormData();
    formData.append("image", fileImage);
    const src = URL.createObjectURL(fileImage);
    document.getElementById("imageDisplay").src = src;
    axios.post("/upload", formData).then((res) => {
        console.log("success");
        fileName = res.data.image;
    });
});

document.getElementById("btnDetectFace").addEventListener("click", (e) => {
    e.preventDefault();

    axios.post("/detectFace", { name: fileName }).then((response) => {
        const result = response.data.data.FaceDetails;
        console.log(result);
    });
});

document.getElementById("btnDetectText").addEventListener("click", (e) => {
    e.preventDefault();

    axios.post("/detectText", { name: fileName }).then((response) => {
        const result = response.data.data.TextDetections;
        console.log(result);
    });
});
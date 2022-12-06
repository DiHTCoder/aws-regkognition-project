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
        var boundingBox = document.getElementById("image-display");
        for (let i = 0; i < result.length; i++) {
            var box = result[i].BoundingBox;
            var image = document.getElementById("imageDisplay");
            boundingBox.innerHTML += `<div class="bounding-box" style="display: block;
                                                            height:${
                                                                box.Height *
                                                                image.height
                                                            }px; 
                                                            width: ${
                                                                box.Width *
                                                                image.width
                                                            }px;
                                                            top: ${
                                                                box.Top *
                                                                image.height
                                                            }px; 
                                                            left: ${
                                                                box.Left *
                                                                image.width
                                                            }px;
                                                            border: 2px solid green"> </div> `;
        }
    });
});

document.getElementById("btnDetectText").addEventListener("click", (e) => {
    e.preventDefault();

    axios.post("/detectText", { name: fileName }).then((response) => {
        const result = response.data.data.TextDetections;
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
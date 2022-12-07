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
document.getElementById("btnDetectLabel").addEventListener("click", (e) => {
  e.preventDefault();

  axios.post("/detectLabel", { name: fileName }).then((response) => {
    var result = response.data.data.Labels;
    var data = document.getElementById("data");
    data.innerHTML = "";
    for (let i = 0; i < result.length; i++) {
      data.innerHTML += `<span> Confidence: ${result[i].Confidence} </span><br>
                                <span> Name: ${result[i].Name}</span>`;
      if (result[i].Parents.length != 0) {
        data.innerHTML += `<br><span> Parents: </span>`;
      }
      for (let j = 0; j < result[i].Parents.length; j++) {
        data.innerHTML += `<span>${result[i].Parents[j].Name} , </span> `;
      }
      data.innerHTML += `<br><br>`;
    }
  });
});
document.getElementById("btnDetectFace").addEventListener("click", (e) => {
  e.preventDefault();

  axios.post("/detectFace", { name: fileName }).then((response) => {
    const result = response.data.data.FaceDetails;
    var boundingBox = document.getElementById("image-display");
    var data = document.getElementById("data");
    data.innerHTML = "";
    for (let i = 0; i < result.length; i++) {
      var color = {
        red: getRandomInt(255),
        green: getRandomInt(255),
        blue: getRandomInt(255),
      };
      data.innerHTML += `<span>Người ${
        i + 1
      }:</span> <span class="color-box" style="border: 2px solid rgb(${
        color.red
      }, ${color.blue}, ${color.green})"></span>`;
      data.innerHTML += `<span> Độ tuổi: ${result[i].AgeRange.Low} đến ${
        result[i].AgeRange.High
      }</span><br />
                                <span>${
                                  result[i].Smile.Value ? "Cười" : "Không cười"
                                }. Độ tin cậy: ${
        result[i].Smile.Confidence
      }</span><br />
                                <span>${
                                  result[i].Eyeglasses.Value
                                    ? "Đeo kính"
                                    : "Không đeo kính"
                                }. Độ tin cậy: ${
        result[i].Eyeglasses.Confidence
      }</span><br />
                                <span> Giới tính: ${
                                  result[i].Gender.Value == "Male"
                                    ? "Nam"
                                    : "Nữ"
                                }. Độ tin cậy: ${
        result[i].Gender.Confidence
      }</span><br />`;

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
                                                            border: 2px solid rgb(${
                                                              color.red
                                                            }, ${color.blue}, ${
        color.green
      })"> </div> `;
    }
  });
});
document.getElementById("btnDetectText").addEventListener("click", (e) => {
  e.preventDefault();

  axios.post("/detectText", { name: fileName }).then((response) => {
    textDisplay(response.data.data);
  });
});

document.getElementById("btnTest").addEventListener("click", (e) => {
  e.preventDefault();

  axios.post("/detectTest", { name: fileName }).then((response) => {
    if (response.data.data.celebrities != null) {
      celebDisplay(response.data.data.celebrities);
    }
    if (response.data.data.text != null) {
      textDisplay(response.data.data.text);
    }
  });
});
function textDisplay(kq) {
  const result = kq.TextDetections;
  var data = document.getElementById("data");
  var boundingBox = document.getElementById("image-display");
  data.innerHTML = "";
  parentId = 0;
  index = 1;
  for (let i = 0; i < result.length; i++) {
    var box = result[i].Geometry.BoundingBox;
    var image = document.getElementById("imageDisplay");
    if (result[i].Type == "LINE")
      data.innerHTML += `<span>Dòng thứ ${result[i].Id + 1}: ${
        result[i].DetectedText
      }</span><br>`;
    else {
      if (result[i].ParentId == parentId) {
        data.innerHTML += `<span>Từ thứ ${index} thuộc dòng thứ ${
          parentId + 1
        }: 
                    ${result[i].DetectedText}</span><br>`;
        index += 1;
      } else {
        index = 1;
        parentId += 1;
        data.innerHTML += `<span>Từ thứ ${index} thuộc dòng thứ ${
          parentId + 1
        }: 
                    ${result[i].DetectedText}</span><br>`;
        index += 1;
      }
    }
    data.innerHTML += `<span>Độ tin cậy: ${result[i].Confidence}%</span>`;
    data.innerHTML += `<br><br>`;
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
}
function celebDisplay(kq) {}


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

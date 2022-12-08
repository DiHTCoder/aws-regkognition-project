# CloudComputing

## Đề tài: Tìm hiểu AMAZON REKONIGTION và viết ứng dụng minh họa

      1. Huỳnh Tiến Dĩ 20110246
      2. Nguyễn Ngọc Duy 20110625
      3. Võ Đinh Quốc Thuật 20110733 
## Các dịch vụ sử dụng

- AWS Rekognition
- AWS EC2 (Amazon Elastic Compute Cloud)
- AWS S3 (Amazon Simple Storage Service)

## Hướng dẫn sử dụng
1. Vào khóa học trên AWS, chọn khóa AWS Academy Learner Lab - Foundation Services [5744]
2. Chọn Modules trên menu bên trái, sau đó chọn Learner Lab - Foundational Services
3. Chọn Start Lab, sau đó nhấn AWS Details để lấy các token trong AWS CLI (aws_access_key_id, aws_secret_access_key, aws_session_token)
4. Dán các thông tin vào file .env
5. Vào dịch vụ Amazon S3 tạo một bucket
6. Lấy tên bucket vừa tạo dán vào biến bucketName trong file server.js
7. Chạy lệnh "npm i" để cài môi trường
8. Chạy lệnh "npm start" để chạy chương trình
9. Mở trình duyệt, dán http://localhost:3000/

## Triển khai project lên Amazon EC2
1. Vào trang dịch vụ EC2, tạo một instance
2. Sử dụng Public DNS để connect instance trong terminal
3. Tải website lên instance bằng lệnh "git clone https://github.com/DiHTCoder/aws-rekognition-project.git"
4. Chuyển đến thư mục vừa clone: cd aws-rekognition-project
5. Làm các bước trong "Hướng dẫn sử dụng" ở trên
6. Quay lại trang EC2 để lấy Public DNS
7. Mở trình duyệt dán Public DNS và vào cổng 3000. Ví dụ: http://ec2-54-174-157-86.compute-1.amazonaws.com:3000/

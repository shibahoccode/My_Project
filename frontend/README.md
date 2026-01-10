Welcome to My Project
Chào mừng bạn đến với dự án của tôi. Dưới đây là hướng dẫn chi tiết để thiết lập và khởi chạy cả hai phần Frontend và Backend trên máy tính cá nhân.

🛠 Công nghệ sử dụng
Frontend: Vite, React, TypeScript, Tailwind CSS, shadcn-ui.

Backend: Java, Spring Boot, Maven.

Quản lý phiên bản: Git.

🚀 Hướng dẫn chạy Frontend (Node.js)
Để chạy phần giao diện, bạn cần cài đặt Node.js và npm.

Clone repository:

Bash

git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
Cài đặt dependencies:

Bash

npm install
Khởi chạy server phát triển:

Bash

npm run dev
Sau khi chạy lệnh, trình duyệt sẽ tự động mở hoặc bạn có thể truy cập qua địa chỉ http://localhost:5173.

⚙️ Hướng dẫn chạy Backend (Spring Boot & Maven)
Để chạy phần máy chủ, bạn cần cài đặt JDK (Java Development Kit) từ phiên bản 17 trở lên và Maven.

Di chuyển vào thư mục backend: (Giả sử thư mục backend nằm trong folder backend)

Bash

cd backend
Cài đặt các gói phụ thuộc (Dependencies):

Bash

mvn clean install
Khởi chạy ứng dụng Spring Boot:

Bash

mvn spring-boot:run
Server backend thường sẽ chạy tại địa chỉ http://localhost:8080.
# Expense Tracker(記帳本)
![Expense Tracker-首頁](/image/Expense%20Tracker%20-%E9%A6%96%E9%A0%81.png)
## 介紹

記錄屬於自己的帳戶支出，使用者可以登入帳戶、記錄支出、新增及刪除支出、依照分類瀏覽支出狀況。
### 功能
* 查看所有支出
* 新增支出
* 編輯支出
* 刪除支出
* 使用者驗證功能
* 可以使用FaceBook帳號登入
* 根據類別篩選支出並依篩選類別瀏覽總金額
## 開始使用

1. 請先確認有安裝 node.js 與 npm
2. 將專案 clone 到本地
3. 在本地開啟之後，透過終端機進入資料夾，輸入：
  ```
  npm install
  ```
4. 與資料庫連線，請繼續輸入：
  ```
  npm run seed
  ```
5. 若看見此行訊息則代表與資料庫連結成功
  ```
  mongoDB connected!
  ```
6. 若看見此行訊息代表種子資料創建成功
 ```
  所有使用者與記帳資料創建完成
  ```
7. 安裝完畢後，繼續輸入
+ 一般啟動:
```
npm run start
```
+ nodemon啟動:
```
npm run dev
```
8. 若看見此行訊息則代表順利運行，打開瀏覽器進入到以下網址
  ```
  App is running on http://localhost:3000
  ```
9. 若欲暫停使用
  ```
  ctrl + c
  ```
### 測試帳號
若種子資料創建成功，可使用測試帳號:
+ 使用者1(廣志):
  - 帳號: example1@gmail.com
  - 密碼: 12345678 
+ 使用者2(小新):
  - 帳號: example2@gmail.com
  - 密碼: 87654321

## 開發工具

* Node.js 18.15.0
* Express 4.18.2
* express-handlebars 4.0.2
* express-session
* Bootstrap 5.1.3
* Font-awesome 6.4.0
* MongoDB
* mongoose 5.9.7
* passport 0.4.1
* passport-facebook 3.0.0
* passport-local 1.0.0
* dotenv
* bcryptjs
* connect-flash
* method-override
* moment 2.29.4
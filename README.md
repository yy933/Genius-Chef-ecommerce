# Genius Chef 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white
)

Genius Chef is a meal-kit delivery service. This full-stack web app is built with Node.js (Express.js framework) and PostgreSQL, and views are rendered through template engine express-handlebars. Users can create an account, browse weekly menu, subscribe to different plans, and make payments with credit card or Paypal.

### [Click me](https://genius-chef.onrender.com/) for live demo 

## Function
* ### Users :
  - Create an account or login with Google or Twitter account.
  - Reset password with unique links sent to users' email.
  - Choose customized plans based on weekly menu and add them to cart.
  - Get order and payment confirmation emails when completing orders.
  - Checkout with credit card (powered by [ECpay](https://www.ecpay.com.tw/Intro/Ecpay_en)) or [Paypal](https://www.paypal.com/).
  - View or cancel orders in the user profile.
  - View or change personal info in the user profile.
  - Subscribe to newsletters.
  - Check weekly menu and recipes.
  - Contact the customer service team with online contact form.
* ### Admin :
  - View, sort, and filter user info ( including user name, ID, account created date, email, current active status, subscription status).
  - View, sort, and filter order info ( including  order ID, user ID, order created date, current status, and order details).
  - Reset password with unique links sent to admin's email.

## Features
* Website is built with Node.js (Express framework)
* Implement CSRF token to prevent CSRF attacks
* Use [express-validator](https://express-validator.github.io/docs) to validate and sanitize form contents
* Protect app with [helmet](https://helmetjs.github.io/) package from security issues
* Request menu and recipe data from [spoonacular API](https://spoonacular.com/food-api) through [axios](https://www.npmjs.com/package/axios)
* Integrate Paypal and credit card checkout using [Paypal APIs](https://developer.paypal.com/api/rest/) and [ECPay API](https://developers.ecpay.com.tw/?p=2509) 
* Database management: PostgreSQL and Sequelize ORM 
* Responsive web design (RWD)

## Set up :
### Pre-requisites :
* [Node.js](https://nodejs.org/en/download/package-manager) @16.14.1
* [npm](https://www.npmjs.com/)
* [PostgreSQL](https://www.postgresql.org/download/) @15

### Environment variables:
| 登入權限  | 角色  | 帳號  | 密碼 |
| ------------- | ------------- | ------------- |:-------------:|
| 後台      | admin      | root      | 12345678     |
| 前台      | user      | user1      | 12345678     |

### Getting Started :
1. Open the terminal and clone the project :
```
git clone https://github.com/yy933/Genius-Chef-ecommerce
```
2. Go to the project file and install dependencies :
```
cd Genius-chef-ecommerce
npm install
```
3. Create your own .env file (refer to .env.example). For environment variables details, please check [Environment variables](#environment-variables) section. 





<br/>

## 安裝與執行步驟 Installation and Execution
1. 請先確認有安裝 Node.js、npm、MySQL workbench
2. 打開終端機(Terminal)，將專案 clone 至本機位置

```
git clone https://github.com/yy933/twitter-api-2020
```
3. 進入存放此專案的資料夾

```
cd twitter-api-2020
```
4. 安裝 npm 套件

```
npm install
```
5. 建立 .env 檔 (參照.env.example)


6. 使用 MySQL Workbench 建立資料庫

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

6. 建立資料表並載入種子資料

```
npx sequelize db:migrate
npx sequelize db:seed:all
```
7. 執行

```
npm run dev
```
8. 若看見此行訊息則代表順利運行，打開瀏覽器進入到以下網址

```
Example app listening on port 3000!
```
9. 若要暫停使用，則輸入

```
ctrl + c
```
<br/>

## 環境建置與需求 Prerequisites

* Node.js 18.12.1
* Express 4.16.4
* mysql2 1.6.4
* sequelize 6.29.3
* sequelize-cli 5.5.0



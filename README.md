# **<div style="text-align: center;">Genius Chef</div>** 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white
)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Genius Chef is a meal-kit delivery service. This full-stack web app is built with Node.js (Express.js framework) and PostgreSQL, and views are rendered through template engine express-handlebars. Users can create an account, browse weekly menu, subscribe to different plans, and make payments with credit card or Paypal.

## <div style="text-align: center;">See live demo [here](https://genius-chef.onrender.com/) !</div>

## **Function**
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
  - Contact the customer service team via online contact form.
* ### Admin :
  - View, sort, and filter user info ( including user name, ID, account created date, email, current active status, subscription status).
  - View, sort, and filter order info ( including  order ID, user ID, order created date, current status, and order details).
  - Reset password with unique links sent to admin's email.

## **Features**
* Website is built with Node.js (Express framework)
* Cookie-based authentication
* Implement CSRF token to prevent CSRF attacks
* Use [express-validator](https://express-validator.github.io/docs) to validate and sanitize form contents
* Protect app with [helmet](https://helmetjs.github.io/) package from security issues
* Request menu and recipe data from [spoonacular API](https://spoonacular.com/food-api) through [axios](https://www.npmjs.com/package/axios)
* Integrate Paypal and credit card checkout using [Paypal APIs](https://developer.paypal.com/api/rest/) and [ECPay API](https://developers.ecpay.com.tw/?p=2509) 
* Database management: PostgreSQL and Sequelize ORM 
* Responsive web design (RWD)

## **Setting up** :
### **Pre-requisites** :
* [Node.js](https://nodejs.org/en/download/package-manager) @16.14.1
* [npm](https://www.npmjs.com/) @8.5.0
* [PostgreSQL](https://www.postgresql.org/download/) @15

### **Environment variables** :
| Name  | Description  | Value  | Note |
| ------------- | ------------- | ------------- |:-------------: |
| **EMAIL**             | Customer service email address of the shop.      | Your Gmail address | <p style="text-align: start"> If using services other than Gmail, please modify settings in [email helper](./helpers/email-helpers.js). For more details, please check [Nodemailer doc](https://nodemailer.com/smtp/). </p>   
| **APP_PASSWORD**      | App password of Google account.  | Your Google app password |Click [me](https://support.google.com/accounts/answer/185833?hl=en) for more details.
| **SESSION_SECRET**    | Secret is used to signed the session id cookie.       | Define a random string that is hard to guess | DO NOT use the same secret as CSRF_COOKIE_SECRET. 
| **API_KEY**      | This key is to request recipe data from spoonacular API. | Your spoonacular API key      | Get API key from [here](https://spoonacular.com/food-api/docs#Authentication) 
| **ADMIN_PASSWORD**      | Admin password for logging into admin console.      | Define your own password. 
| **BASE_URL**      | The root of the website address.      | Default: http://localhost:8080 |<p style="text-align:start;"> [Twitter doesn't accept localhost as a callback URL.](https://developer.twitter.com/en/docs/apps/callback-urls) For https address, consider using [ngrok](https://ngrok.com/) or similar services to generate a tunnel URL. </p>
| **GOOGLE_CLIENT_ID**      | Google uses a client ID to identify users and call Google API.      | Your Google client ID | For more details, please check [Google Identity](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid). 
| **GOOGLE_CLIENT_SECRET**      | The secret that only known to the app and Google authorization server.      | Your Google client secret |  For more details, please check [Google Identity](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid). 
| **TWITTER_CLIENT_ID**      | Twitter uses a client ID to identify users and call Twitter API. | Your Twitter API key | For more details, please check [Twitter API docs](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/api-key-and-secret). 
| **TWITTER_CLIENT_SECRET**      | The secret that only known to the app and Twitter authorization server. | Your Twitter API secret | For more details, please check [Twitter API docs](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/api-key-and-secret). 
| **PAYPAL_CLIENT_ID**      | Paypal uses a client ID and client secret to authenticate API calls in Paypal integrations. | Your Paypal client ID | For more details, please check [Paypal API docs](https://developer.paypal.com/api/rest/). 
| **PAYPAL_SECRET_KEY**      | Paypal uses a client ID and client secret to authenticate API calls in Paypal integrations.      | Your Paypal client secret | For more details, please check [Paypal API docs](https://developer.paypal.com/api/rest/).  
| **CSRF_COOKIE_SECRET**      | This secret will be hashed with the random csrf token and set in the cookie. | Define a random string that is hard to guess. | DO NOT use the same secret as SESSION_SECRET. 
| **REMOTE_DB_URL**      | The url of the remote database used in production.  | Your database url     

### **Getting Started** :
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




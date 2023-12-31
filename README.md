# **<div style="text-align: center;">Genius Chef</div>** 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white
)
![Handlebars](https://img.shields.io/badge/Handlebars%20js-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=black)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


### Genius Chef is a meal-kit delivery service. This full-stack web app is built with Node.js (Express.js framework) and PostgreSQL, and views are rendered through the template engine express-handlebars. Users can create an account, browse the weekly menu, subscribe to different plans, and make payments with credit cards or Paypal. ###

## <div style="text-align: center;">See live demo [here](https://genius-chef.onrender.com/) !</div>

### <div style="text-align: center;">For admin console, click [me](https://genius-chef.onrender.com/admin/login). </div>

![index](https://s11.gifyu.com/images/ScQZd.gif)
![login](https://s11.gifyu.com/images/ScQZI.gif)
![RWD_index](https://s11.gifyu.com/images/ScQZ7.gif)
![RWD_cart](https://s11.gifyu.com/images/ScQZq.gif)


## **Function**
* ### Users :
  - Create an account or log in with Google or Twitter account.
  - Reset password with unique links sent to users' email.
  - Choose customized plans based on the weekly menu and add them to the cart.
  - Get order and payment confirmation emails when completing orders.
  - Checkout with credit card (powered by [ECpay](https://www.ecpay.com.tw/Intro/Ecpay_en)) or [Paypal](https://www.paypal.com/).
  - View or cancel orders in the user profile.
  - View or change personal info in the user profile.
  - Subscribe to newsletters.
  - Check weekly menu and recipes.
  - Contact the customer service team via a online contact form.
* ### Admin :
  - View, sort, and filter user info ( including user name, ID, account created date, email, current active status, and subscription status).
  - View, sort, and filter order info ( including  order ID, user ID, order created date, current status, and order details).
  - Reset password with unique links sent to admin's email.

## **Test accounts for live demo** 
### **User** 
| Email  | Password  | Role  | 
| ------------- | ------------- |:-------------: |
| user1@example.com | Password12345 | user | 
| geniuschef2023@gmail.com | Geniuschef2023 | admin | 
### **Payment** 
>  **Note: Both credit card and Paypal payments are in testing mode and no real payments will be made. Using payment info other than the info below might lead to payment failure.**

| Payment method  | details  | 
| ------------- |:-------------: |
| Credit Card | <p style="text-align:start;">Card number : 4311-9522-2222-2222 <br> CVV code : 222 <br> Card expiry(MM/YYYY) : Any valid date that is  greater than the test date.</p> | 
| Paypal | <p style="text-align:start;">Email: sb-8oexo26947509@personal.example.com <br> Password: Abcde12345 </p>

## **Features**
* Website is built with Node.js (Express framework).
* Cookie-based authentication
* Implement CSRF token to prevent CSRF attacks.
* Use [express-validator](https://express-validator.github.io/docs) to validate and sanitize form contents.
* Protect app with [helmet](https://helmetjs.github.io/) package from security issues.
* Request menu and recipe data from [spoonacular API](https://spoonacular.com/food-api) through [axios](https://www.npmjs.com/package/axios).
* Cache menu data on the first request to [spoonacular API](https://spoonacular.com/food-api) and save the results in Redis.
* Integrate Paypal and credit card checkout using [Paypal APIs](https://developer.paypal.com/api/rest/) and [ECPay API](https://developers.ecpay.com.tw/?p=2509).
* Database management: PostgreSQL and Sequelize ORM 
* Responsive web design (RWD)

## **Setting up** :
<br>

### **Pre-requisites** :
* [Node.js](https://nodejs.org/en/download/package-manager) @16.14.1
* [npm](https://www.npmjs.com/) @8.5.0
* [PostgreSQL](https://www.postgresql.org/download/) @15
* [Redis](https://redis.io/) @7.0.11

<br>

### **Environment variables** :
| Name  | Description  | Value  | Note |
| ------------- | ------------- | ------------- |:-------------: |
| **EMAIL**             | Customer service email address of the shop.      | Your Gmail address | <p style="text-align: start"> If using services other than Gmail, please modify settings in [email helper](./helpers/email-helpers.js). For more details, please check [Nodemailer doc](https://nodemailer.com/smtp/). </p>   
| **APP_PASSWORD**      | App password of Google account.  | Your Google app password |Click [me](https://support.google.com/accounts/answer/185833?hl=en) for more details.
| **SESSION_SECRET**    | Secret is used to signed the session id cookie.       | Define a random string that is hard to guess | DO NOT use the same secret as CSRF_COOKIE_SECRET. 
| **API_KEY**      | This key is to request recipe data from spoonacular API. | Your spoonacular API key      | Get API key from [here](https://spoonacular.com/food-api/docs#Authentication) 
| **ADMIN_PASSWORD**      | Admin password for logging into admin console.      | Define your password. | <p style="text-align:start;"> Password rule: The password must contain at least 8 and maximum 16 characters, including at least 1 uppercase, 1 lowercase, and one number. </p>
| **BASE_URL**      | The root of the website address.      | Default: http://localhost:8080 |<p style="text-align:start;"> [Twitter doesn't accept localhost as a callback URL.](https://developer.twitter.com/en/docs/apps/callback-urls) For https address, consider using [ngrok](https://ngrok.com/) or similar services to generate a tunnel URL. </p>
| **GOOGLE_CLIENT_ID**      | Google uses a client ID to identify users and call Google API.      | Your Google client ID | For more details, please check [Google Identity](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid). 
| **GOOGLE_CLIENT_SECRET**      | The secret that only known to the app and Google authorization server.      | Your Google client secret |  For more details, please check [Google Identity](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid). 
| **TWITTER_CLIENT_ID**      | Twitter uses a client ID to identify users and call Twitter API. | Your Twitter API key | For more details, please check [Twitter API docs](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/api-key-and-secret). 
| **TWITTER_CLIENT_SECRET**      | The secret that only known to the app and Twitter authorization server. | Your Twitter API secret | For more details, please check [Twitter API docs](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/api-key-and-secret). 
| **PAYPAL_CLIENT_ID**      | Paypal uses a client ID and client secret to authenticate API calls in Paypal integrations. | Your Paypal client ID | For more details, please check [Paypal API docs](https://developer.paypal.com/api/rest/). 
| **PAYPAL_SECRET_KEY**      | Paypal uses a client ID and client secret to authenticate API calls in Paypal integrations.      | Your Paypal client secret | For more details, please check [Paypal API docs](https://developer.paypal.com/api/rest/).  
| **CSRF_COOKIE_SECRET**      | This secret will be hashed with the random csrf token and set in the cookie. | Define a random string that is hard to guess. | DO NOT use the same secret as SESSION_SECRET. 
| **REMOTE_DB_URL**      | The url of the remote **PostgreSQL database** used in production.  | Your database url  |
| **REDIS_DB_URI**      | The url of the remote **Redis database** used in production.  | Your database url  |

<br>

### <p style="color: #EE4F2D;">  Note: It is highly recommended using [ngrok](https://ngrok.com/) or similar services to generate a tunnel URL when developing. When using http://localhost:8080 URL in some browsers, the session cookie and the csrf token cookie might not be successfully set. In that case, modify the cookie settings in [session cookie](app.js) and [csrf token cookie](./middleware/csrf-token.js).  </p>    

<br>

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
4. Database setting up :
* **PostgreSQL:**
    Create a connection with config vars in  [config.json](./config/config.json). Then create a database for development and name it genius_chef_dev.  
You can create it with PostgreSQL GUI (e.g. [pgAdmin](https://www.pgadmin.org/)) or CLI ([psql](https://www.postgresql.org/docs/current/app-psql.html#:~:text=Description,or%20from%20command%20line%20arguments.)).
```
// psql commands
psql postgres --u postgres

postgres-# CREATE ROLE root WITH LOGIN PASSWORD 'champions';
postgres-# ALTER ROLE root CREATEDB;
postgres-# \q

psql postgres -U root

postgres=> CREATE DATABASE genius_chef_dev;
postgres=> GRANT ALL PRIVILEGES ON DATABASE genius_chef_dev TO root;
postgres=> \q
```
* **Redis:**
    Create a connection with config in [redis.js](./config/redis.js).  You can create it with Redis GUI (e.g. [RedisInsight](https://github.com/RedisInsight/RedisInsight)) or CLI ([redis-cli](https://redis.io/docs/ui/cli/)).
```
// redis-cli commands

// connect to Redis remote server, running on host 127.0.0.1 and port 6379
$redis-cli -h 127.0.0.1 -p 6379 

// testing if the connection is alive. PONG will be returned if the Redis server is up and has no errors.
redis 127.0.0.1:6379> PING  
PONG

// Do some tests to make sure data can be successfully written into the database.
redis 127.0.0.1:6379> SET food "Yummy"
"OK"
redis 127.0.0.1:6379> GET food
"Yummy"  
redis 127.0.0.1:6379> DEL food
(integer) 1
redis 127.0.0.1:6379> GET food
(nil)
```

5. Run migrations and seeders with following commands in the terminal:
```
// run all migrations
npm run migrate

// run all seeders
npm run seed
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Undo migrations and seeders:
```
// undo all migrations
npm run dmigrate

// undo all seeders
npm run dseed
```
6. Build and run the project:
```
npm run dev
```
7. The message `App is running on http://localhost:8080` will be shown on the console if the app executes successfully. Navigate to http://localhost:8080 to check the result. 

> Note: Run `npm run build` command after updating style settings in any scss file. A new [`main.css`]([./public/stylesheets/src/dist/main.css](https://github.com/yy933/Genius-Chef-ecommerce/blob/master/public/stylesheets/src/dist/main.css)https://github.com/yy933/Genius-Chef-ecommerce/blob/master/public/stylesheets/src/dist/main.css) file will be generated. 
<br/>

## **Developers** :
[Emily Yu](https://github.com/yy933)




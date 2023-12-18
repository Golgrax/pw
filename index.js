
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const Database = require('@replit/database');
const { customAlphabet } = require('nanoid');
const { readFile } = require('fs').promises;

const db = new Database();
db.list("prefix").then(matches => {});
db.list().then(keys => {});
db.delete("key").then(() => {});
db.get("key").then(value => {});
db.set("key", "value").then(() => {});

 const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
const size = 5;
const nanoid = customAlphabet(alphabet, size);
const idRegex = new RegExp(`^[${alphabet}]{${5}}$`);

const app = express();
app.use(morgan('dev'));

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const html = readFile('index.html');

/**
 * GET /
 */
app.get('/', async (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(await html);
});


app.get("/public/index.html", (_, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("App.js", (_, res) => {
  res.sendFile(__dirname + "App.js");
});





/**
 * POST /
 */
app.post('/', urlencodedParser, async (req, res) => {
  const { url } = req.body;
  res.set('Content-Type', 'text/html');

  if (!url) {
    res.send(await html);
    return;
  }

  // ensure id is unique
  
  
  
  

  
  
  
  
  let id;
  while (true) {
    id = nanoid();
    if (!(await db.get(id))) {
      await db.set(id, url);
      break;
    }
  }

  const shortenedUrl = `${req.get('host')}/${id}`;
  const block = `
    <p>
     Your Shortened URL:
      <a href="${id}" rel="noopener noreferrer" target="_blank">
        ${shortenedUrl}
      </a>
    </p>
  `;

  res.send((await html) + block);
});

/**
 * GET /:id
 */
app.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!idRegex.test(id)) {
    return next();
  }

  const fullUrl = await db.get(id);
  if (!fullUrl) {
    return next();
  }

  res.redirect(301, fullUrl);
});


 
app.get('/db-empty', async (req, res, next) => {
  await db.empty();
  res.send('Database Emptied');
});



app.use((req, res) => {
  res.status(404).send(`

<link rel="icon" href="https://scontent.fmnl26-1.fna.fbcdn.net/v/t1.6435-9/fr/cp0/e15/q65/149424624_112870227504878_693764282341521760_n.jpg?_nc_cat=103&amp;ccb=1-3&amp;_nc_sid=85a577&amp;efg=eyJpIjoidCJ9&amp;_nc_eui2=AeE66rVn6WaJBtOGwJdeVJNgxMNENXRepzrEw0Q1dF6nOnlKvQsDa3089ba8uWCOzBPGdcrODXugCgzpdJDywLpq&amp;_nc_ohc=Uf4Kctv5B0QAX96QMv-&amp;_nc_ht=scontent.fmnl26-1.fna&amp;oh=2f22b5a6009adb896753bccaad956047&amp;oe=60F7F61E">


<head>

<style type=text/css>


p {    color: #fff000;    
font-weight: 4500;   
font-size: 100px;    
font-family: Helvetica, Arial, sans-serif;   
 }


h1 {    color: #fff000;    
font-weight: 4500;   
font-size: 100px;    
font-family: Helvetica, Arial, sans-serif;   
 }

</style>
</head>
<center>


<h1>ERROR 404</h1>
<h1>Not Found</h1>
<body style="background-color:#000000;">

<br> 
<p>:(</p>


<p><b>go back to main page? <button onclick="location.href='https://benjo.is-a.dev/'" type="button"

href="default.asp" target="_blank"><b>click here</b></button></b></p>


</body>
</center>




  `);
});

/**
 * Error
 */
app.use((err, req, res, next) => {
  next(err);
});






 
 
 
 
 

 
 
 





const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port %d', port));
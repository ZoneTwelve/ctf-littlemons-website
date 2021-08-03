#!/usr/bin/env node
const url = require("url");
const http = require("http");
const puppeteer = require("puppeteer");
const fs = require("fs");
const app = new route( { pub:"" } );
var browser;
var mem = [];
(async () => {
  browser = await puppeteer.launch({
    headless: true
  });
  // page = await browser.newPage();
  // await page.goto('https://example.com');
  // await page.screenshot({ path: 'example.png' });

  // await browser.close();
})();

function route( conf ){
  this.pub = __dirname + "/" + conf.pub; 
  this.routing = { };
}

route.prototype.use = function( path, func ){
  this.routing[ path ] = func;
}

route.prototype.serve = function( req, res ){
  if( req.url.indexOf("/package.json") > -1 )
    return res.end("Nice try, hacker LOL");
  try{
    let pre = this.preprocess( req, res );
    req = pre.req;
    res = pre.res;
    let f = this.routing && this.routing[ req.url ];
    let pub = this.pub + req.url;
    if( f ){
      f( req, res );
    }else if( fs.existsSync( pub )){
      if( /\/$/.test( pub ) ){
        pub += "index.html";
      }
      
      res.end( fs.readFileSync( pub ) );
    }else{
      res.end( "404 Not found" );
    }
  }catch(e){
    res.end("Nice try, you let me crash");
  }
}

route.prototype.preprocess = function( req, res){
  let _url = url.parse( req.url, true );
  if( _url.search)
    req.url = req.url.replace( _url.search, '' );
  req.query = _url.query;
  return { req, res };
}

app.use("/", (req, res) => {
  res.setHeader('Location', '/public');
  res.end(fs.readFileSync("public/redirect.html"));
});

app.use("/report", (req, res) => {
  if( req.query.url == undefined ){
    res.end( fs.readFileSync("public/report.html") );
  }else{
    
    try{
      let path = `http://localhost:3000/${url.parse( req.query.url, true )['path']}`;
      if( mem.length < 5 ){
        mem.push( path )
        adminCheckURL( mem.length-1 );
        res.end("OK, i will fix that.");
      }else{
        res.end("Too mach work need to do, wait for me a second.");
      }
    }catch(e){
      res.end("I can not fix that one");
    }
  }
});


app.use("/demo", (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  if( req.query.style ){
    res.end(req.query.style)
  }else{
    res.end("test");
  }
});

app.use("/login", (req, res)=>{
  console.log( req.query );
  res.end("OK");
});

const server = http.createServer( (req, res) => app.serve( req, res ) );
server.listen( parseInt(process.env.PORT) || 3000, ( ) => {
  console.log("Server is binding");
});
let key = "Z0{CSS_k3yl0gg3r}";
async function adminCheckURL( i ){
  let u = mem[i];
  let page = await browser.newPage();
  await page.goto( u );
  
  await page.waitForSelector('input[name="account"]')  
  await page.focus('input[name="account"]');
  for(let k of "admin"){
    await delay(~~(Math.random() * 200) + 10);
    await page.keyboard.type( k );
  }
  await page.waitForSelector('input[name="password"]')  
  await page.focus('input[name="password"]');
  for(let k of key){
    await delay(~~(Math.random() * 300) + 10);
    await page.keyboard.type( k );
  }
  await page.waitForSelector('[type="submit"]')  
  await page.focus('[type="submit"]');
  await page.keyboard.press("Enter");
  setTimeout( async () => {
    mem.splice(i, 1);
    await page.close();
  }, 3000);
  // browser.close()
}
function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

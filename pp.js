const puppeteer = require("puppeteer")
const jsonFIle = require("./base.json")
const jsonFIle2 = require("./help.json")
const fs = require('fs');
const cors = require("cors")
const express = require("express");
const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};
const app = express()
app.use(express.json())
app.use(cors())
app.listen(8000)
app.get("/options",(req,res)=>{
    const opcje = Object.getOwnPropertyNames(jsonFIle)
    var arr = []
    for(var x=0;x<opcje.length;x++){
        if(opcje[x]=="gen1"){
            break;
        }
        arr.push(opcje[x])
    }
    res.send(arr).end()
})
app.post("/option",(req,res)=>{
    const {string} = req.body
    var data = jsonFIle[string]
    res.json(data)
})
function group(arr){
    
    var newArray = {}
    for(var x=0;x<arr.length;x++){
        if(newArray[arr[x].country]!==undefined){
            newArray[arr[x].country].push(arr[x].sign)
        }else{
            newArray[arr[x].country]=arr[x].sign
        }
    }
    var data = JSON.stringify(newArray)
    console.log(data)
    fs.writeFileSync("file.txt",data,"utf-8",(err)=>{
        if(!err){
            console.log("git")
        }
    })
}

async function getData(){
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    
    // Navigate to the website
    await page.goto('https://geohints.com/LicensePlates');
    const divData = await page.evaluate(async () => {
        const delay = (time) => {
            return new Promise((resolve) => setTimeout(resolve, time));
        };
        window.scrollTo(0, document.body.scrollHeight);   
        await delay(2000)
             // Select all divs with a specific class
        const divs = document.querySelectorAll('div');
        
        // Extract data from each div
        const data = [];
        divs.forEach(div => {
            const item = {
                sign: div.querySelectorAll('img'),
                country: div.querySelector('b')?.textContent,
                // Add more fields as necessary
            };
            var arr = []
            for(var x=0;x<item.sign.length;x++){
                arr.push(item.sign[x].src)
            }
            item.sign=arr
            data.push(item);
        });
        return data;
    });
    // divData.forEach(e=>{
    //     e.country=e.country.slice(0,e.country.length-3)
    // })
    group(divData)
    await browser.close();
}
// getData()
var objekt = jsonFIle
    var countries = Object.getOwnPropertyNames(jsonFIle2)
   for(var x=0;x<countries.length;x++){
    objekt[countries[x]]= [...objekt[countries[x]],...jsonFIle2[countries[x]]]
   }
fs.writeFileSync("file.txt",JSON.stringify(objekt),"utf-8",(err)=>{
    if(!err){
        console.log("git")
    }
})
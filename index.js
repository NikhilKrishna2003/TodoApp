const express = require('express');
var bodyparser = require('body-parser');
const fs = require("fs");
const app = express();
const path = require('path');
const cors = require("cors");
var PORT = 3000;

app.use(cors());
app.use(bodyparser.json());
app.use(express.json());

var cine=[];

function findAtIndex(arr,index){
    for(var i=0;i<arr.length;i++){
        if(arr[i].id==index)return i;
    }
    return -1;
}

function removeAtIndex(arr,index){
    var newarr=[];
    for(var i=0;i<arr.length;i++){
        if(i!=index)newarr.push(arr[i]);
    }
    return newarr;
}

app.get("/index",(req,res)=>{
    fs.readFile("db.json","utf8",(err,data)=>{
        if(err) throw err;
        res.status(201).json(JSON.parse(data));
    })
})

var cnt=1;
app.post("/index",(req,res)=>{
    var newarr={
        id: cnt,
        movie: req.body.movie,
        hero: req.body.hero
    }
    cnt+=1;
    fs.readFile("db.json","utf8",(err,data)=>{
        if(err) throw err;
        const cine = JSON.parse(data);
        cine.push(newarr);
        fs.writeFile("db.json",JSON.stringify(cine),(err)=>{
            if(err) throw err;
            res.status(201).json(newarr);
        })
    })
})


app.delete("/index/:id",(req,res)=>{
    fs.readFile("db.json","utf8",(err,data)=>{
        if(err) throw err;
        var cine = JSON.parse(data); 
        var cineindex = findAtIndex(cine,parseInt(req.params.id));
        if(cineindex==-1){
            res.status(404).send();
        }else{
            cine=removeAtIndex(cine,cineindex);
            fs.writeFile("db.json",JSON.stringify(cine),(err)=>{
                if(err) throws in err;
                res.status(201).send();
            })
        }
    })
})

app.use((req,res,next)=>{
    res.status(201).send();
})

app.listen(PORT,(req,res)=>{
    console.log(`example is listening on the ${PORT}`)
})

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"front.html"));
})
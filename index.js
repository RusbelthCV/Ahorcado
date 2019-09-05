const express = require("express");
const app = express();
const body_parser = require("body-parser");
const session = require("cookie-session");
const port = 3000;

app.use(body_parser.urlencoded({extended: true}));
app.use(session({secret: "todotopsecret"}));
app.set("view engine","jade");

app.use(function(req,res,next){
    if(typeof(req.session.palabra) == 'undefined'){
        req.session.palabra = '';
        req.session.letras = [];
        req.session.acertadas = '';
    }
    next();
});

app.get("/todo",function(req,res){
    if(req.session.palabra == ''){
        res.redirect("/todo/palabra");
    }
    else{
        res.redirect("/todo/letras");
    }
});

app.get("/todo/palabra",function(req,res){
    res.render("palabra");
});

app.post("/todo/add",function(req,res){
    req.session.palabra = req.body.palabra;
    res.redirect("/todo");
});

app.get("/todo/letras",function(req,res){
    res.render("letras",{palabra: req.session.palabra, letras: req.session.letras, acertadas: req.session.acertadas}); 
});

app.post("/todo/comprobar",function(req,res){
    let letra = req.body.letra;
    let pos = req.session.palabra.indexOf(letra) 
    if(pos == -1){
        req.session.letras.push(letra);
        res.redirect("/todo/letras");
    }
    else{
        req.session.acertadas.charAt(pos) = letra;
        res.render("/todo/letras");
    }
});

// app.get("/todo/fallo",function(req,res){
//     res.render("letras",{letras: req.session.letras});
// })

app.use(function(req,res){
    res.redirect("/todo");
});

app.listen(port,function(){
    console.log("Escuchando desde el puerto: "+port);
});
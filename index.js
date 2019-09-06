const express = require("express");
const app = express();
const body_parser = require("body-parser");
const session = require("cookie-session");
const port = 3000;

app.use(body_parser.urlencoded({ extended: true }));
app.use(session({ secret: "todotopsecret" }));
app.set("view engine", "jade");

app.use(function (req, res, next) {
    if (typeof (req.session.palabra) == 'undefined') {
        req.session.palabra = "";
        req.session.letras = [];
        req.session.acertadas = [];
        req.session.intentos = 0;
        req.session.guiones = "";
    }
    next();
});

app.get("/todo", function (req, res) {
    if (req.session.palabra == '') {
        res.redirect("/todo/palabra");
    }
    else {
        res.redirect("/todo/letras");
    }
});

app.get("/todo/palabra", function (req, res) {
    res.render("palabra");
});

app.post("/todo/add", function (req, res) {
    req.session.palabra = req.body.palabra;
    for (let i = 0; i < req.session.palabra.length; i++) {
        req.session.guiones = req.session.guiones + "-";
    }
    res.redirect("/todo");
});

app.get("/todo/letras", function (req, res) {
    
    if (req.session.intentos <= 5) {

        res.render("letras", { palabra: req.session.guiones, letras: req.session.letras });
    }
    else {
        res.render("game_over");
    }
});

app.post("/todo/comprobar", function (req, res) {
    let letra = req.body.letra;
    if(req.session.palabra.indexOf(letra) > -1){
        req.session.acertadas.push(letra);
    }
    else{
        req.session.letras.push(letra);
        req.session.intentos++;
    }
    req.session.guiones = req.session.palabra.split("").map(el => req.session.acertadas.indexOf(el) === -1 ? "-" : el).join("");
    if(req.session.guiones == req.session.palabra){
        res.redirect("ganador");
    }
    else{
        res.redirect("/todo/letras");
    }
    
});

app.get("/todo/otraPartida",function(req,res){
    req.session=null;
    res.redirect("/todo");
});

app.use(function (req, res) {
    res.redirect("/todo");
});

app.listen(port, function () {
    console.log("Escuchando desde el puerto: " + port);
});
//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const parse = require("node-html-parser").parse;
const fs = require("fs");
const { log } = require("console");
const app = express();

const port = 3000;
const adminKod = "ng6602";

var data = {};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.redirect(req.headers.host + "fooldal");
});

app.get("/fooldal", function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/style.css", function (req, res) {
    res.sendFile(__dirname + '/style.css');
});

app.post("/", function (req, res) {
    const kod = req.body.kod;    
    if (kod === adminKod) {
        res.sendFile(__dirname + "/admin.html");        
    } else if (kod === data.kod) {
        res.redirect(data.link);
    }

});

app.post("/general", function (req, res) {
    const link = req.body.link;
    var genKod = "";
    for (i = 0; i < 6; i++) {
        var number = Math.floor(Math.random() * 10);
        genKod += number.toString();
    }

    fs.readFile('admin.html', 'utf8', (err, html) => {
        if (err) {
            throw err;
        }

        const root = parse(html);

        const body = root.querySelector('body');
        //body.set_content('<div id = "asdf"></div>');
        body.appendChild('<p class="kod">Kód: ' + genKod + '</p>');
        body.appendChild('<form action="/fooldal" method="get"> <button class="submit-btn" type="submit">Vissza</button> </form>');
        
        // console.log(root.toString()); // This you can write back to file!
        res.send(root.toString());
    });
    
    data = {
        kod: genKod,
        link: link
    }

    console.log(data.genKod + " " + data.link);

});

// app.post("/fooldal", function(req, res){
//     res.sendFile(__dirname + "/index.html");
// });

app.listen(port, function () {
    console.log("Server up and runnin' on port " + port);
});

const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        res.render("index", { files: files });
    })
})

app.get("/file/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        res.render("details", { filename: req.params.filename, filedata: filedata });
    })
})

app.post("/update/:filename", (req, res) => {
    fs.rename(`./files/${req.params.filename}`, `./files/${req.body.newTitle.split(' ').join('')}.txt`, (err) => {
        if (err) {
            return res.status(500).send("Error renaming file");
        }

        fs.writeFile(`./files/${req.body.newTitle.split(' ').join('')}.txt`, req.body.newDetails, (err) => {
            if (err) {
                return res.status(500).send("Error Updatind file");
            }
            res.redirect("/");
        })
    })
})

app.get("/update/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        if (err) {
            return res.status(500).send("File not found");
        }
        res.render("edit", { filename: req.params.filename, filedata: filedata });
    });
});


app.get("/details", (req, res) => {
    res.render("details");
})

app.post("/create", (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
        res.redirect("/");
    });
})
app.listen(process.env.PORT, (req, res) => {
    console.log(`Server is running on ${process.env.PORT}`);
})
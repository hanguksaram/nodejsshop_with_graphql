const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const db = require('./util/database')


const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

db.execute('SELECT * FROM products')
  .then(result => {
    console.log(result)
  }).catch(err => {
    console.log(err)
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: "404" });
});

app.listen(3000);

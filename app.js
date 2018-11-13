const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const middleware = require("./middleware/middleware");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//instantiate middlewares
app.use(middleware.attachUserToRequestContext(User));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: "404" });
});

//describing relations between tables
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem })
Order.belongsToMany(Product, { through: OrderItem });
(async () => {
    await sequelize.sync( );
    const user = await User.findByPk(1);
    if (!user) {
      user = await User.create({ name: "host", email: "test@test.com" });
    }
    const userCart = await user.getCart();
    if (!userCart) userCart = await user.createCart();
  }
)().then(() => {
  console.log("server runned");
  app.listen(3000);
});

//разница между промисчэин хэлом и приятным последовательным авэйт стайлом
// .then(result => {
//   return ;
// })
// .then(user => {
//   if (!user) {
//     return ;
//   }
//   return user;
// })
// .then(user => {
//   return user.getCart();
// })
// .then(cart => {
//   if (!cart) {
//     return;
//   }
// })
// .catch(err => {
//   console.log(err);
// });

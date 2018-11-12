const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title } = req.body;
  const product = new Product(title);
  //fully functional model object pattern, repo or service layer dosnt exist
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  // //promise way
  Product.findAll().then(
    products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Produc",
        path: "/products"
      });
    },
    error => res.status(500).send(error)
  );
};

exports.addProductToCart = (req, res, next) => {
  const { productId } = req.params;
  Cart.addProduct(productId).then(
    () => res.redirect("/"),
    error => res.status(400).send(error)
  );
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  //anotherApproach
  // Product.findAll({ where: { id: productId }})
  //   .then(products => console.log(products[0]))
  Product.findById(productId).then(
    data => {
      if (data.dataValues) {
        console.log(data, "DATA")
        res.render("shop/product-detail", {
          path: "/product-detail",
          pageTitle: "Product Detail",
          ...data.dataValues
        });
      } else {
        res
          .status(404)
          .render("404", { pageTitle: "Page Not Found", path: "404" });
      }
    },
    error => {
      res.status(500).send(error);
    }
  );
};

// Product.fetchAllCb(products => {
//     res.render('shop', {
//       prods: products,
//       pageTitle: 'Shop',
//       path: '/',
//       hasProducts: products.length > 0,
//       activeShop: true,
//       productCSS: true
//     });
//   })

exports.getIndex = (req, res, next) => {
  Product.findAll().then(
    products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    },
    error => res.status(500).send(error)
  );
};

exports.getCart = async (req, res, next) => {
  console.log(req.user.cart)
  const cart = await req.user.getCart()
  if (cart) console.log(cart)
  // const cart = Cart.getCart();
  // console.log(cart);
  // if (cart) {
  //   res.render("shop/cart", {
  //     path: "/cart",
  //     pageTitle: "Your Cart",
  //     cart
  //   });
  // } else {
  //   res.redirect("/products");
  // }
};

exports.removeProductFromCart = (req, res, next) => {
  const { productId } = req.body;
  if (Cart.deleteProductFromCart(productId)) {
    res.redirect("/cart");
  } else {
    res.status(404).render("404", { pageTitle: "Page Not Found", path: "404" });
  }
};

exports.changeProductCount = (req, res, next) => {
  const { increment, productId } = req.query;
  if (Cart.changeProductCountInCart(increment, productId)) {
    res.redirect("/cart");
  } else {
    res.status(404).render("404", { pageTitle: "Page Not Found", path: "404" });
  }
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders"
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Shop",
    path: "/"
  });
};

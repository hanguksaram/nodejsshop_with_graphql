const Product = require("../models/product");

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
  Product.fetchAll().then(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/products",
    });
  });

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
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  })
}

exports.getCheckout = ( req, res, next ) => {
  res.render("shop/checkout", {
    pageTitle: "Shop",
    path: "/",
  });
} 
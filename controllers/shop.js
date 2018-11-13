const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");
const genericRequestHandler = require("../util/extensions");

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
  //req.user.getCart
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
  const user = req.user;
  genericRequestHandler(
    async () => {
      const cart = await user.getCart();
      if (cart) {
        let product = await cart.getProducts({ where: { id: productId } });
        if (product.length > 0) {
          product = product[0];
          let newQuantity = product.cartItem.quantity;
          ++newQuantity;
          cart.addProduct(product, { through: { quantity: newQuantity } });
        } else {
          product = await Product.findByPk(productId);
          if (product) {
            await cart.addProduct(product, { through: { quantity: 1 } });
          }
        }
      }
    },
    () => res.redirect("/products"),
    res,
    () => false
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
        console.log(data, "DATA");
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

exports.getCart = (req, res, next) => {
  genericRequestHandler(
    async () => {
      const cart = await req.user.getCart();
      if (cart) {
        const productsInCart = await cart.getProducts();
        if (productsInCart.length > 0) {
          console.log(productsInCart);
          return productsInCart;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    data => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        productsInCart: data
      });
    },
    res,
    () => true
  );
};

exports.removeProductFromCart = (req, res, next) => {
  const { productId } = req.body;
  genericRequestHandler(
    async () => {
      const cart = await req.user.getCart();
      if (cart) {
        const products = await cart.getProducts({ where: { id: productId } });
        if (products.length > 0) {
          await products[0].cartItem.destroy();
        }
      }
    },
    () => res.redirect("/products"),
    res,
    () => false
  );
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
  genericRequestHandler(
    async () => {
      return req.user.getOrders({include: ['products']});
    },
    data => {
      console.log(data)
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: data
      });
    }, res, () => true
  );
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Shop",
    path: "/"
  });
};

exports.postOrder = (req, res, next) => {
  genericRequestHandler(
    async () => {
      const cart = await req.user.getCart();
      if (cart) {
        const [products, order] = await Promise.all([
          cart.getProducts(),
          req.user.createOrder()
        ]);
        order.addProducts(
          products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
        cart.setProducts(null);
      } else {
        return null;
      }
    },
    () => res.redirect("/orders"),
    res,
    () => false
  );
};

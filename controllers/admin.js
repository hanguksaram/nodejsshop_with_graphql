const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};
//сознателбный бэд дизайн один экшн на креаэйт и апдейт и раскратие логики модели в колбэках экщна ну такое  прям)
exports.putProduct = (req, res, next) => {
  const { id = -1, title, imageUrl, price, description } = req.body;
  const product = new Product(id, title, imageUrl, description, price);
  //fully functional model object pattern, repo or service layer dosnt exist
  product.save(product);
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products"
    });
  });
};

// exports.postEditProduct = (req, res, next) => {
//   const
// }

exports.getEditProduct = (req, res, next) => {
  const { editMode } = req.query;
  if (!editMode) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  Product.findById(productId).then(
    product => {
      if (!product) {
        res
          .status(404)
          .render("404", { pageTitle: "Page Not Found", path: "404" });
      } else {
        console.log(product);
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          product
        });
      }
    },
    error => {
      res.status(500).send(error);
    }
  );
};

exports.removeProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteProduct(id).then(
    data => {
      console.log(data)
      if (data) {
        res.redirect("/admin/products");
      } else {
        res.status(404).render("404", {
          pageTitle: "Page Not Found",
          path: "404"
        });
      }
    },
    error => res.status(500).send(error)
  );
};

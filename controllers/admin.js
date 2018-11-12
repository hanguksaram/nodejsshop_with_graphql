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
  // const { id = -1, title, imageUrl, price, description } = req.body;
  //spread operator let u create amazing things)
  const { id, ...rest } = req.body;
  if (!id) {
    //another way to create related one-to-many entity distributed by sequelize
    req.user.createProduct({
      ...rest,
    }).catch(err => res.status(500).send(err));
    // Product.create({
    //   ...rest,
    //   userId: req.user.dataValues.id
    // }).catch(err => res.status(500).send(error));
  } else {
    Product.findByPk(id)
      .then(product => {
        //eazy mappping, btw java how is it going? D

        for (const key in rest) {
          if (product.dataValues.hasOwnProperty(key)) {
            product[key] = rest[key];
          }
        }
        product.save();
      })
      .catch(err => res.status(500).send(error));
  }
  res.redirect("/admin/products");
  //fully functional model object pattern, repo or service layer dosnt exist
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then(products => {
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
  // Product.findById(productId)
  req.user.getProducts({where: {id: productId}})
    .then(
    product => {
      if (!product) {
        res
          .status(404)
          .render("404", { pageTitle: "Page Not Found", path: "404" });
      } else {
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          ...product[0].dataValues
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
  Product.destroy({where: {id: productId}})
  res.redirect("/admin/products")
};

const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin')

const rootDir = require('../util/path');

const router = express.Router();



// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts)

// /admin/add-product => POST
router.post('/put-product', adminController.putProduct)

router.get('/edit-product/:productId', adminController.getEditProduct)



module.exports = router;


var express = require('express');
var router = express.Router();

const {
  postal_codes,
  products,
  cart_items,
  shippingCharges,
} = require('../library/data.js');
const {
  searchPostalCode,
  searchProduct,
  addProduct,
  getTotalAmount,
} = require('../library/helperFunctions.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get distance from warehouse to delivery address
router.get('/warehouse/distance', async (req, res) => {
  if (postal_codes.length > 0) {
    const result = searchPostalCode(postal_codes, req.query.postal_code);
    if (result.status === 'error') res.status(400).send(result);
    else res.status(200).send(result);
  } else res.status(200).send('Invalid Postal Code');
});

// Get product details
router.get('/product/:id', async (req, res) => {
  if (products.length > 0) {
    const result = searchProduct(products, req.params.id);
    if (result.status === 'error') res.status(400).send(result);
    else res.status(200).send(result);
  } else res.status(200).send('Product not available');
});

// Adding item to cart
router.post('/cart/item', async (req, res) => {
  if (products.length > 0) {
    const result = searchProduct(products, req.body.product_id);
    if (result.status === 'error') {
      res.status(400).send(result);
    } else {
      const response = addProduct(
        cart_items,
        result.product,
        req.body.quantity
      );
      res.status(200).send(response);
    }
  } else res.status(200).send('Product not available');
});

// Getting all items in cart
router.get('/cart/items', async (req, res) => {
  if (cart_items.length == 0) {
    res.status(400).send('Cart is empty');
  } else {
    res.status(200).send({
      status: 'success',
      message: 'Item available in cart',
      items: cart_items,
    });
  }
});

// Empty cart
router.post('/cart/items', async (req, res) => {
  if (req.body.action == 'empty_cart') {
    cart_items.length = 0;
    res.status(200).send({
      status: 'success',
      message: 'All items have been removed from cart !',
    });
  } else res.status(400).send('Error state. Bad request');
});

// Get total amount
router.get('/cart/checkout-value', async (req, res) => {
  if (postal_codes.length > 0) {
    const result = searchPostalCode(
      postal_codes,
      req.query.shipping_postal_code
    );
    if (result.status === 'error') res.status(400).send(result);
    else {
      const response = getTotalAmount(
        cart_items,
        result.distance_in_kilometers,
        req.query.shipping_postal_code,
        shippingCharges
      );
      res.status(200).send(response);
    }
  }
});

module.exports = router;

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const searchProduct = (arr, value) => {
  var result = { status: '' };
  for (let i in arr) {
    if (arr[i].id == value) {
      result.status = 'success';
      result.product = arr[i];
      return result;
    }
  }
  if (result.status === '') {
    result.status = 'error';
    result.message =
      'Invalid product id. Valid product id range is 100 to 110.';
    return result;
  }
};

const searchPostalCode = (arr, value) => {
  var result = { status: '' };
  for (let i in arr) {
    if (arr[i].postal_code == value) {
      result.status = 'success';
      result.distance_in_kilometers = arr[i].distance_in_kilometers;
      return result;
    }
  }
  if (result.status === '') {
    result.status = 'error';
    result.message = 'Invalid postal code, valid ones are 465535 to 465545.';
    return result;
  }
};

const addProduct = (cart_items, product, quantityVal) => {
  var result = { status: '' };
  const productIndex = cart_items.findIndex((item) => item.id == product.id);
  if (productIndex == -1) {
    cart_items.push({
      ...product,
      quantity: quantityVal,
    });
  } else {
    cart_items[productIndex].quantity += quantityVal;
  }

  result.status = 'success';
  result.message = 'Item has been added to cart';
  return result;
};

const getTotalAmount = (cart_items, distance, postal_code, shippingCharges) => {
  let result = {};
  let [totalWeight, totalPrice, discountedAmount, amountAfterDiscount] = [
    0,
    0,
    0,
    0,
  ];
  for (let i in cart_items) {
    // Calculating total weight
    totalWeight += cart_items[i].weight_in_grams * cart_items[i].quantity;

    // calculating discount amount
    discountedAmount =
      (cart_items[i].price / 100) * cart_items[i].discount_percentage;

    // Finding the final amount after applying discount
    amountAfterDiscount =
      cart_items[i].price * cart_items[i].quantity -
      discountedAmount * cart_items[i].quantity;
    totalPrice += amountAfterDiscount;
  }
  // calling function to get shipping amount
  const shippingAmount = getShippingAmount(
    totalWeight / 1000,
    distance,
    shippingCharges
  );

  // Formatting the price value with dollar currency
  finalCartAmount = formatter.format(totalPrice + shippingAmount);

  result.status = 'success';
  result.message = `Total value of your shopping cart is - ${finalCartAmount}`;
  return result;
};

const getShippingAmount = (weight, distance, shippingCharges) => {
  if (weight < 2) {
    if (50 <= distance < 500)
      return shippingCharges[0].amount_with_distance.fifty_to_500km;
    else if (500 <= distance < 800)
      return shippingCharges[0].amount_with_distance.fivehundred_to_800km;
  } else if (2.01 < weight <= 5) {
    if (50 <= distance < 500)
      return shippingCharges[1].amount_with_distance.fifty_to_500km;
    else if (500 <= distance < 800)
      return shippingCharges[1].amount_with_distance.fivehundred_to_800km;
  } else if (5.01 < weight <= 20) {
    if (50 <= distance < 500)
      return shippingCharges[2].amount_with_distance.fifty_to_500km;
    else if (500 <= distance < 800)
      return shippingCharges[2].amount_with_distance.fivehundred_to_800km;
  } else if (weight > 20.01) {
    if (50 <= distance < 500)
      return shippingCharges[3].amount_with_distance.fifty_to_500km;
    else if (500 <= distance < 800)
      return shippingCharges[3].amount_with_distance.fivehundred_to_800km;
  }
};

module.exports = {
  searchProduct,
  searchPostalCode,
  addProduct,
  getTotalAmount,
};

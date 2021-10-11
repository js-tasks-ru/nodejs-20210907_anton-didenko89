const Product = require('../models/Product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  let products = await Product.find({subcategory: subcategory});

  if (!subcategory) return next();

  ctx.body = {
    products: products.map((product) => {
      return {
        id: product._id,
        title: product.title,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        description: product.description
      }
    })
  };
};

module.exports.productList = async function productList(ctx, next) {
  let products = await Product.find({});

  if (!products) {
    ctx.throw(404, 'Products are not found')
  }

  ctx.body = {
    products: products.map((product) => {
      return {
        id: product._id,
        title: product.title,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        description: product.description
      }
    })
  };
};

module.exports.productById = async function productById(ctx, next) {
  if(!ObjectId.isValid(ctx.params.id)) {
    ctx.throw(400, 'Id is not valid')
  }

  let product = await Product.findById(ctx.params.id);

  if (!product) {
    ctx.throw(404, 'Product is not found')
  }

  ctx.body = { product: {
      id: product._id,
      title: product.title,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      description: product.description
    }};
};


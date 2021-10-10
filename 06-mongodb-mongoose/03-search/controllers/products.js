const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  let products = await Product.find({$text: {$search: ctx.request.query.query}},
    {score: {$meta: "textScore"}}
  ).sort( { score: { $meta: "textScore" } } );

  ctx.body = {products: products.map((p) => {
      return {
        id: p._id,
        title: p.title,
        images: p.images,
        category: p.category,
        subcategory: p.subcategory,
        price: p.price,
        description: p.description
      }
    })};
};

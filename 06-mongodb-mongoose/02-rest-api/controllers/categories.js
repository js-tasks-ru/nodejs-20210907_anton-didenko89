const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {

  let categories = await Category.find({});

  ctx.body = {
    categories: categories.map((category) => {
      let result = {
        id: category._id,
        title: category.title,
        subcategories: category.subcategories
      }
      result.subcategories = category.subcategories.map(subcategory => {
        return {
          id: subcategory._id,
          title: subcategory.title
        }
      })
      return result;
    })
  };
};

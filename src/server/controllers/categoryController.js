const Category = require('../models/categoryModel');
// Local Data File
// const categories = JSON.parse(fs.readFileSync(`../assets/data/menu_data.json`));
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories: categories,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  category = await Category.findById(req.params.id);
  // Category.findOne({ _id: req.params.id})

  if (!category) {
    return next(new AppError('No category found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      category: category,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  // const newCategory = new Category({});
  // newCategory.save();
  // console.log(req.body);

  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return modified doc, not original
    runValidators: true, // validates the update operation
  });

  if (!category) {
    return next(new AppError('No category found with that Id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category: category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError('No category found with that Id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {},
  });
});

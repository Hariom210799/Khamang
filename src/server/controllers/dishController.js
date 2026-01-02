const Dish = require('../models/dishModel');
const User = require('../models/userModel');
const Menu = require('../models/menuModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const cloudinary = require('cloudinary');

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('☁️ Cloudinary configured for cloud:', process.env.CLOUDINARY_CLOUD_NAME);

exports.getAllDishes = catchAsync(async (req, res, next) => {
  const dishes = await Dish.find();
  res.status(200).json({
    status: 'success',
    results: dishes.length,
    data: {
      dishes,
    },
  });
});

exports.getSingleDish = catchAsync(async (req, res, next) => {
  dish = await Dish.findById(req.params.id);
  console.log('DD', dish);
  console.log(req.params.id);
  if (!dish) {
    return next(new AppError('No dish found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      dish,
    },
  });
});

exports.createDish = catchAsync(async (req, res, next) => {
  // ✅ Image URL comes from client (already uploaded to Cloudinary)
  const { name, cuisine_type, price, available, category_name, maker_id, menu_id, image } = req.body;
  
  console.log('🔵 CREATE DISH:');
  console.log('  Full request body:', JSON.stringify(req.body, null, 2));
  console.log('  Name:', name);
  console.log('  Image URL:', image || 'NO IMAGE');
  console.log('  Image type:', typeof image);
  console.log('  Image is null:', image === null);
  console.log('  Image is undefined:', image === undefined);
  console.log('  Category:', category_name);
  
  if (!name || !category_name || !maker_id) {
    console.log('❌ VALIDATION FAILED');
    return next(new AppError('Missing required fields', 400));
  }
  
  const dishData = {
    name: name.trim(),
    cuisine_type: cuisine_type ? cuisine_type.trim() : 'veg',
    price: parseFloat(price) || 0,
    available: true,
    maker_id: maker_id,
    category_name: category_name.trim(),
    image: image || null, // Cloudinary URL or null
  };
  
  console.log('✅ Dish data prepared:', JSON.stringify(dishData, null, 2));
  
  let newDish;
  try {
    newDish = await Dish.create(dishData);
    console.log('✅ Dish created:', newDish._id);
    console.log('✅ Dish created with image:', newDish.image);
  } catch (createError) {
    console.log('❌ Dish creation error:', createError.message);
    
    // Handle duplicate key error for same maker
    if (createError.code === 11000) {
      const field = Object.keys(createError.keyPattern)[0];
      if (field === 'name') {
        return next(new AppError(`A dish with name "${name}" already exists for this maker. Please use a different name.`, 400));
      }
      return next(new AppError(`Duplicate entry for ${field}`, 400));
    }
    
    throw createError;
  }
  
  try {
    // CRITICAL FIX: Use menu_id if provided, otherwise lookup by maker_id
    let menu;
    if (menu_id) {
      menu = await Menu.findById(menu_id);
    } else {
      menu = await Menu.findOne({ maker_id: maker_id });
    }
    
    if (!menu) {
      console.log('❌ Menu not found');
      return res.status(201).json({ status: 'success', data: { dish: newDish } });
    }
    
    const searchName = category_name.trim().toLowerCase();
    let found = false;
    let catIndex = -1;
    
    // Loop through and find the category
    for (let i = 0; i < menu.categories.length; i++) {
      const catTitle = menu.categories[i].title ? menu.categories[i].title.trim().toLowerCase() : '';
      
      if (catTitle === searchName) {
        catIndex = i;
        
        if (!Array.isArray(menu.categories[i].dishes)) {
          menu.categories[i].dishes = [];
        }
        
        // CRITICAL FIX: Normalize dishes array - convert objects to IDs only
        menu.categories[i].dishes = menu.categories[i].dishes.map(d => {
          // If it's an object with _id, extract just the _id
          if (d && typeof d === 'object' && d._id) {
            return d._id;
          }
          // Otherwise keep as is (already an ObjectId or string)
          return d;
        });
        
        // Now push the new dish as ObjectId
        menu.categories[i].dishes.push(newDish._id);
        
        // CRITICAL: Mark the nested array as modified so Mongoose saves it
        menu.markModified('categories');
        await menu.save();
        console.log('✅ Menu updated with new dish');
        
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('⚠️ Category not found. Search:', searchName, 'Available:', menu.categories.map(c => c.title));
    }
    
  } catch (err) {
    console.log('❌ Error:', err.message, err.stack);
  }
  
  res.status(201).json({
    status: 'success',
    data: { dish: newDish },
  });
});

exports.updateDish = catchAsync(async (req, res, next) => {
  console.log('🔵 UPDATING Dish', req.params.id);
  console.log('📦 Update request body:', JSON.stringify(req.body, null, 2));
  
  const { name, cuisine_type, price, image } = req.body;
  
  // ✅ Update the dish document - image URL comes from client (already uploaded to Cloudinary)
  const updateData = {
    name: name,
    cuisine_type: cuisine_type,
    price: price,
  };
  
  // If image URL is provided in request, use it
  if (image) {
    console.log('🖼️ Image URL provided:', image);
    updateData.image = image;
  }
  
  console.log('✅ Update data prepared:', JSON.stringify(updateData, null, 2));
  
  const dish = await Dish.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  
  if (!dish) {
    return next(new AppError('No dish found with that Id', 404));
  }
  
  console.log('✅ Dish document updated:', dish.name);
  
  // ✅ Also update the menu subdocument
  const menu = await Menu.findById(req.body.menu_id);
  if (menu) {
    const category_index = menu.categories.findIndex(function (category) {
      return category.title === req.body.category_name;
    });
    
    if (category_index !== -1) {
      const dish_index = menu.categories[category_index].dishes.findIndex(function (ele) {
        return ele._id.toString() === req.params.id;
      });
      
      if (dish_index !== -1) {
        // Update all fields in the subdocument
        if (req.body.name) menu.categories[category_index].dishes[dish_index].name = req.body.name;
        if (req.body.cuisine_type) menu.categories[category_index].dishes[dish_index].cuisine_type = req.body.cuisine_type;
        if (req.body.price) menu.categories[category_index].dishes[dish_index].price = req.body.price;
        if (imageFile) menu.categories[category_index].dishes[dish_index].image = updateData.image;
        if (req.body.available !== undefined) menu.categories[category_index].dishes[dish_index].available = req.body.available;
        
        // Mark as modified and save
        menu.markModified('categories');
        await menu.save();
        console.log('✅ Menu subdocument updated');
      }
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      dish,
    },
  });
});

exports.deleteDish = catchAsync(async (req, res, next) => {
  console.log('🗑️ Delete Dish Controller - ID:', req.params.id);
  console.log('📦 Delete request body:', req.body);

  try {
    // Validate required fields
    if (!req.body.menu_id || !req.body.category_name) {
      console.log('❌ Missing menu_id or category_name');
      return next(new AppError('menu_id and category_name are required', 400));
    }

    // Find the menu
    const menu = await Menu.findById(req.body.menu_id);
    if (!menu) {
      console.log('❌ Menu not found:', req.body.menu_id);
      return next(new AppError('Menu not found', 404));
    }
    console.log('✅ Menu found');

    // Find category index
    const category_index = menu.categories.findIndex(function (category) {
      return category.title === req.body.category_name;
    });
    
    if (category_index === -1) {
      console.log('❌ Category not found:', req.body.category_name);
      return next(new AppError('Category not found', 404));
    }
    console.log('✅ Category found at index:', category_index);

    // Find dish in category
    const dish_index = menu.categories[category_index].dishes.findIndex(function (dish) {
      return dish._id.toString() === req.params.id;
    });

    if (dish_index === -1) {
      console.log('❌ Dish not found in category:', req.params.id);
      return next(new AppError('Dish not found in this category', 404));
    }
    console.log('✅ Dish found at index:', dish_index);

    // Remove dish from menu categories
    const dishName = menu.categories[category_index].dishes[dish_index].name;
    menu.categories[category_index].dishes.splice(dish_index, 1);
    console.log('✅ Dish removed from menu:', dishName);

    // Update menu in database
    const updated_menu = await Menu.findByIdAndUpdate(menu._id, menu, {
      new: true,
      runValidators: true,
    });
    console.log('✅ Menu updated in database');

    // Delete dish from Dish collection
    const deleted = await Dish.findByIdAndDelete(req.params.id);
    console.log('✅ Dish deleted from Dish collection:', deleted?.name);

    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'Dish deleted successfully',
      data: {
        deletedDish: dishName,
      },
    });
  } catch (error) {
    console.log('❌ Delete dish error:', error.message);
    throw error;
  }
});

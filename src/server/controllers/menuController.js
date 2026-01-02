const Menu = require('../models/menuModel');
const Dish = require('../models/dishModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  console.log('Getting all Menus');
  const menus = await Menu.find();
  res.status(200).json({
    status: 'success',
    results: menus.length,
    data: {
      menus,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  console.log('🔵 GET CATEGORY for:', req.params.id);
  
  let menu = await Menu.findById(req.params.id);
  
  if (!menu) {
    menu = await Menu.findOne({maker_id: req.params.id});
  }
  
  if (!menu) {
    return next(new AppError('No Menu found', 404));
  }
  
  console.log('✅ Found menu with', menu.categories.length, 'categories');
  
  // Convert to plain objects for modification
  const categories = menu.categories.map(cat => ({
    title: cat.title,
    dishes: cat.dishes || [],
  }));
  
  for (let i = 0; i < categories.length; i++) {
    let cat = categories[i];
    console.log(`📂 Category ${i} (${cat.title}):`, cat.dishes ? cat.dishes.length : 0, 'dishes');
    
    if (cat.dishes && Array.isArray(cat.dishes) && cat.dishes.length > 0) {
      try {
        // CRITICAL FIX: Extract ObjectIds only - some dishes might be stored as objects
        const dishIds = cat.dishes.map(d => {
          // If d is an object with _id, extract _id; otherwise use d directly
          if (d && typeof d === 'object' && d._id) {
            return d._id;
          }
          return d;
        });
        
        console.log(`   Extracted IDs:`, dishIds.map(id => id.toString ? id.toString() : String(id)));
        
        // Use .lean() for better performance and ensure all fields are included
        const dishes = await Dish.find({_id: {$in: dishIds}}).lean();
        console.log(`   ✅ Found`, dishes.length, 'dishes in database');
        
        // Ensure all dishes have image field (convert undefined to null)
        const enrichedDishes = dishes.map(dish => ({
          ...dish,
          image: dish.image || null, // Convert undefined to null explicitly
        }));
        
        // Log first dish to verify image field exists
        if (enrichedDishes.length > 0) {
          console.log(`   First dish:`, {
            name: enrichedDishes[0].name,
            image: enrichedDishes[0].image,
            hasImage: !!enrichedDishes[0].image,
          });
        }
        cat.dishes = enrichedDishes;
      } catch (e) {
        console.log(`   ❌ Error fetching dishes:`, e.message);
        cat.dishes = [];
      }
    } else {
      cat.dishes = [];
    }
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      menu: categories,
      id: menu._id,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  console.log('🔵 CREATE CATEGORY - makerId:', req.params.id, 'Category:', req.body.title);
  
  // Find or create menu for this maker
  let menu = await Menu.findOne({maker_id: req.params.id});
  
  if (!menu) {
    console.log('📍 Menu not found, creating new one');
    menu = await Menu.create({
      maker_id: req.params.id,
      categories: [],
    });
  }
  
  console.log('✅ Using menu:', menu._id);
  
  // Add category to menu
  menu.categories.push(req.body);
  menu.markModified('categories');
  await menu.save();
  
  console.log('✅ Category added and saved');

  res.status(200).json({
    status: 'success',
    data: {
      menu: menu,
      menuId: menu._id,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  console.log('Creating a Menu');
  const newMenu = await Menu.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      newMenu,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  console.log('Deleting Category');
  const menu = await Menu.findById(req.body.id);
  //   console.log('Finded Menu', menu);
  menu.categories = menu.categories.filter(
    (category) => category.title != req.body.title,
  );
  const new_menu = await Menu.findByIdAndUpdate(req.body.id, menu, {
    new: true,
    runValidators: true,
  });
  console.log('Menu after Del', new_menu);
  if (!menu) {
    console.log('From Del');
    return next(new AppError('No menu found with that Id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: [],
  });
});

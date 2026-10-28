// server/src/seed.js
// Utility script to populate the database with sample recipes and a demo chef user

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Recipe from './models/Recipe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const sampleRecipes = [
  {
    title: 'Fluffy Buttermilk Pancakes',
    category: 'Breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '2 cups all-purpose flour',
      '2 tsp baking powder',
      '1/2 tsp baking soda',
      '2 tbsp sugar',
      '1/2 tsp salt',
      '2 cups buttermilk',
      '2 large eggs',
      '1/4 cup melted butter',
    ],
    steps:
      '1. In a large bowl, whisk together flour, baking powder, baking soda, sugar, and salt.\n2. In a separate bowl, whisk buttermilk, eggs, and melted butter.\n3. Gently fold wet ingredients into dry ingredients until just combined (lumps are fine).\n4. Heat a lightly greased griddle over medium heat.\n5. Pour 1/4 cup batter for each pancake. Flip when bubbles burst and cook until golden brown.\n6. Serve warm with butter and maple syrup.',
  },
  {
    title: 'Creamy Garlic Parmesan Pasta',
    category: 'Dinner',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281242?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '8 oz fettuccine or penne pasta',
      '3 cloves garlic, finely minced',
      '2 tbsp unsalted butter',
      '1 cup heavy whipping cream',
      '1/2 cup freshly grated parmesan cheese',
      '1/4 tsp black pepper',
      'Fresh parsley for garnish',
    ],
    steps:
      '1. Bring a large pot of salted water to boil and cook pasta al dente according to package instructions.\n2. In a large pan, melt butter over medium heat and sauté minced garlic for 1 minute until fragrant.\n3. Pour in heavy cream and bring to a gentle simmer for 3 minutes.\n4. Stir in grated parmesan until creamy and melted.\n5. Toss pasta with the sauce and garnish with parsley and fresh black pepper.',
  },
  {
    title: 'Crispy Avocado & Black Bean Tacos',
    category: 'Lunch',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '6 small corn tortillas',
      '1 can black beans, rinsed and drained',
      '2 ripe avocados, sliced',
      '1 cup shredded red cabbage',
      '1/2 cup fresh cilantro',
      '1 lime, cut into wedges',
      '1/2 tsp ground cumin',
      'Salsa verde or hot sauce',
    ],
    steps:
      '1. Heat black beans in a skillet with cumin, a pinch of salt, and a splash of water for 4 minutes.\n2. Warm corn tortillas on a dry skillet until pliable and slightly charred.\n3. Layer warm beans, avocado slices, and shredded cabbage onto each tortilla.\n4. Squeeze fresh lime juice over top and finish with cilantro and salsa.',
  },
  {
    title: 'Decadent Chocolate Lava Cake',
    category: 'Dessert',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '4 oz bittersweet dark chocolate',
      '1/2 cup unsalted butter',
      '1 cup powdered sugar',
      '2 whole eggs + 2 egg yolks',
      '6 tbsp all-purpose flour',
      'Vanilla ice cream for serving',
    ],
    steps:
      '1. Preheat oven to 425°F (220°C). Grease and cocoa-dust four 6-ounce ramekins.\n2. Melt chocolate and butter together in a microwave-safe bowl in 30-second increments.\n3. Stir in powdered sugar until smooth, then whisk in eggs and yolks.\n4. Stir in flour just until combined.\n5. Divide batter into ramekins and bake for 12-14 minutes until edges are firm but centers are soft.\n6. Let cool 1 minute, invert onto plates, and serve immediately with vanilla ice cream.',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Find or create a demo chef
    let demoUser = await User.findOne({ email: 'chef@recipebook.com' });
    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      demoUser = await User.create({
        name: 'Chef Auguste',
        email: 'chef@recipebook.com',
        password: hashedPassword,
      });
      console.log('Created demo chef user: chef@recipebook.com / password123');
    }

    // Check existing recipes
    const count = await Recipe.countDocuments();
    if (count === 0) {
      for (const recipe of sampleRecipes) {
        await Recipe.create({
          ...recipe,
          user: demoUser._id,
          savedBy: [],
        });
      }
      console.log(`Successfully seeded ${sampleRecipes.length} recipes!`);
    } else {
      console.log(`Database already has ${count} recipes, skipping seed.`);
    }

    await mongoose.disconnect();
    console.log('Seeding finished.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seed();


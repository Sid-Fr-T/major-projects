// server/src/controllers/productController.js
// Handles retrieval, creation, updating, and deletion of products

import mongoose from 'mongoose';
import Product from '../models/Product.js';
import seedProducts from '../data/seedProducts.js';

/**
 * Auto-seeds initial 8 products if collection is empty
 */
export const checkAndSeedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('No products found. Auto-seeding 8 initial products...');
      await Product.insertMany(seedProducts);
      console.log('8 products seeded successfully!');
    }
  } catch (error) {
    console.error('Auto-seed check failed:', error.message);
  }
};

/**
 * @desc    Get all products (with optional search query)
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      query = {
        $or: [
          { name: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
        ],
      };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error(`Get Products Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving products', error: error.message });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Product not found (invalid ID format)' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(`Get Product Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving product', error: error.message });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private
 */
export const createProduct = async (req, res) => {
  try {
    const { name, price, imageUrl, description, stock } = req.body;

    if (!name || price === undefined || !imageUrl) {
      return res.status(400).json({ message: 'Please provide name, price, and image URL' });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      imageUrl: imageUrl.trim(),
      description: description ? description.trim() : '',
      stock: stock !== undefined ? Number(stock) : 0,
      user: req.user ? req.user._id : null,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error(`Create Product Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error creating product', error: error.message });
  }
};

/**
 * @desc    Update a product by ID
 * @route   PUT /api/products/:id
 * @access  Private
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, imageUrl, description, stock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Product not found (invalid ID format)' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name !== undefined) product.name = name.trim();
    if (price !== undefined) product.price = Number(price);
    if (imageUrl !== undefined) product.imageUrl = imageUrl.trim();
    if (description !== undefined) product.description = description.trim();
    if (stock !== undefined) product.stock = Number(stock);

    const updatedProduct = await product.save();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(`Update Product Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error updating product', error: error.message });
  }
};

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/products/:id
 * @access  Private
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Product not found (invalid ID format)' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    return res.status(200).json({ message: 'Product removed successfully', id });
  } catch (error) {
    console.error(`Delete Product Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error deleting product', error: error.message });
  }
};


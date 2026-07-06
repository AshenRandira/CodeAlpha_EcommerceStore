import mongoose from 'mongoose';
import Product from '../models/Product.js';

export async function getProducts(req, res, next) {
  try {
    const products = await Product.find({}).sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: 'Invalid product ID.',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const SHIPPING_FIELDS = [
  {
    key: 'fullName',
    label: 'Full name',
    maxLength: 120,
  },
  {
    key: 'addressLine1',
    label: 'Address',
    maxLength: 200,
  },
  {
    key: 'city',
    label: 'City',
    maxLength: 100,
  },
  {
    key: 'postalCode',
    label: 'Postal code',
    maxLength: 40,
  },
  {
    key: 'country',
    label: 'Country',
    maxLength: 100,
  },
];

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function validateShippingAddress(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return {
      error: 'Shipping address is required.',
    };
  }

  const shippingAddress = {};

  for (const field of SHIPPING_FIELDS) {
    const rawValue = value[field.key];

    if (typeof rawValue !== 'string' || !rawValue.trim()) {
      return {
        error: `${field.label} is required.`,
      };
    }

    const normalizedValue = rawValue.trim();

    if (normalizedValue.length > field.maxLength) {
      return {
        error: `${field.label} is too long.`,
      };
    }

    shippingAddress[field.key] = normalizedValue;
  }

  return {
    shippingAddress,
  };
}

function getSafeOrder(order) {
  const source = order.toObject();

  return {
    _id: source._id.toString(),
    user: source.user.toString(),
    items: source.items.map((item) => ({
      product: item.product.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    shippingAddress: {
      fullName: source.shippingAddress.fullName,
      addressLine1: source.shippingAddress.addressLine1,
      city: source.shippingAddress.city,
      postalCode: source.shippingAddress.postalCode,
      country: source.shippingAddress.country,
    },
    subtotal: source.subtotal,
    status: source.status,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

export async function createOrder(req, res, next) {
  try {
    const body =
      req.body &&
      typeof req.body === 'object' &&
      !Array.isArray(req.body)
        ? req.body
        : null;

    if (!body) {
      return res.status(400).json({
        message: 'Order data is required.',
      });
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({
        message: 'Order must contain at least one item.',
      });
    }

    const shippingValidation = validateShippingAddress(
      body.shippingAddress,
    );

    if (shippingValidation.error) {
      return res.status(400).json({
        message: shippingValidation.error,
      });
    }

    const normalizedItems = [];
    const seenProductIds = new Set();

    for (const [index, item] of body.items.entries()) {
      if (
        !item ||
        typeof item !== 'object' ||
        Array.isArray(item)
      ) {
        return res.status(400).json({
          message: `Order item ${index + 1} is invalid.`,
        });
      }

      const productId =
        typeof item.productId === 'string'
          ? item.productId.trim()
          : '';

      if (!mongoose.isObjectIdOrHexString(productId)) {
        return res.status(400).json({
          message: `Order item ${index + 1} has an invalid product ID.`,
        });
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({
          message: `Order item ${index + 1} quantity must be an integer of at least 1.`,
        });
      }

      if (seenProductIds.has(productId)) {
        return res.status(400).json({
          message: 'Duplicate products are not allowed in an order.',
        });
      }

      seenProductIds.add(productId);

      normalizedItems.push({
        productId,
        quantity: item.quantity,
      });
    }

    const productIds = normalizedItems.map(
      (item) => item.productId,
    );

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    }).select('name price stock');

    const productsById = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ]),
    );

    if (products.length !== normalizedItems.length) {
      return res.status(404).json({
        message: 'One or more products were not found.',
      });
    }

    let subtotal = 0;

    const orderItems = [];

    for (const item of normalizedItems) {
      const product = productsById.get(item.productId);

      if (!product) {
        return res.status(404).json({
          message: 'One or more products were not found.',
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units of ${product.name} are available.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      subtotal += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: shippingValidation.shippingAddress,
      subtotal: roundCurrency(subtotal),
    });

    return res.status(201).json({
      order: getSafeOrder(order),
    });
  } catch (error) {
    if (error?.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Order data is invalid.',
      });
    }

    return next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      orders: orders.map(getSafeOrder),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: 'Invalid order ID.',
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.',
      });
    }

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'You do not have access to this order.',
      });
    }

    return res.status(200).json({
      order: getSafeOrder(order),
    });
  } catch (error) {
    return next(error);
  }
}
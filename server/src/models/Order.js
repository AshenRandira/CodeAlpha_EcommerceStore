import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Order item product is required.'],
    },
    name: {
      type: String,
      required: [true, 'Order item name is required.'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Order item price is required.'],
      min: [0, 'Order item price cannot be negative.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Order item quantity is required.'],
      min: [1, 'Order item quantity must be at least 1.'],
      validate: {
        validator: Number.isInteger,
        message: 'Order item quantity must be an integer.',
      },
    },
  },
  {
    _id: false,
  },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Shipping full name is required.'],
      trim: true,
      maxlength: [120, 'Shipping full name is too long.'],
    },
    addressLine1: {
      type: String,
      required: [true, 'Shipping address is required.'],
      trim: true,
      maxlength: [200, 'Shipping address is too long.'],
    },
    city: {
      type: String,
      required: [true, 'Shipping city is required.'],
      trim: true,
      maxlength: [100, 'Shipping city is too long.'],
    },
    postalCode: {
      type: String,
      required: [true, 'Shipping postal code is required.'],
      trim: true,
      maxlength: [40, 'Shipping postal code is too long.'],
    },
    country: {
      type: String,
      required: [true, 'Shipping country is required.'],
      trim: true,
      maxlength: [100, 'Shipping country is too long.'],
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order user is required.'],
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) =>
          Array.isArray(items) && items.length > 0,
        message: 'Order must contain at least one item.',
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, 'Shipping address is required.'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Order subtotal is required.'],
      min: [0, 'Order subtotal cannot be negative.'],
    },
    status: {
      type: String,
      enum: [
        'placed',
        'processing',
        'completed',
        'cancelled',
      ],
      default: 'placed',
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
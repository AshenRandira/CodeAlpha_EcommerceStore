import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const products = [
  {
    name: "Aurora Wireless Headphones",
    description:
      "Over-ear wireless headphones with soft memory-foam cushions, rich stereo sound, and long battery life for work, travel, and everyday listening.",
    price: 129.99,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    category: "Audio",
    stock: 18,
  },
  {
    name: "Vertex Mechanical Keyboard",
    description:
      "Compact mechanical keyboard with tactile switches, durable keycaps, and a clean layout designed for productive work and gaming setups.",
    price: 89.99,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 24,
  },
  {
    name: "Pulse Smartwatch",
    description:
      "Lightweight smartwatch with activity tracking, notification support, heart-rate monitoring, and an all-day battery for an active lifestyle.",
    price: 159.99,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    category: "Wearables",
    stock: 12,
  },
  {
    name: "Nova Portable Speaker",
    description:
      "Compact Bluetooth speaker with clear sound, punchy bass, simple controls, and a portable design for indoor and outdoor listening.",
    price: 69.99,
    imageUrl:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80",
    category: "Audio",
    stock: 30,
  },
  {
    name: "Orbit USB-C Hub",
    description:
      "Versatile USB-C hub that expands a single port with practical connections for displays, storage devices, accessories, and charging.",
    price: 49.99,
    imageUrl:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 35,
  },
  {
    name: "Ember Insulated Bottle",
    description:
      "Reusable insulated bottle designed to keep drinks at a comfortable temperature while fitting easily into daily routines and travel bags.",
    price: 34.99,
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
    category: "Lifestyle",
    stock: 42,
  },
  {
    name: "Atlas Everyday Backpack",
    description:
      "Practical everyday backpack with a spacious main compartment, comfortable shoulder straps, and organized storage for work or university.",
    price: 74.99,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    category: "Bags",
    stock: 20,
  },
  {
    name: "Luma LED Desk Lamp",
    description:
      "Minimal LED desk lamp with adjustable positioning and comfortable task lighting for study desks, workspaces, and reading areas.",
    price: 44.99,
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    category: "Home Office",
    stock: 16,
  },
  {
    name: "Glide Wireless Mouse",
    description:
      "Comfortable wireless mouse with responsive tracking, quiet controls, and a lightweight shape suited to everyday productivity.",
    price: 39.99,
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 28,
  },
  {
    name: "Focus HD Webcam",
    description:
      "Full HD webcam designed for clear video calls, online classes, and remote meetings with a compact monitor-friendly design.",
    price: 79.99,
    imageUrl:
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 14,
  },
];

async function seedProducts() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const deleteResult = await Product.deleteMany({});
    console.log(
      `Cleared ${deleteResult.deletedCount} existing product(s).`
    );

    const insertedProducts = await Product.insertMany(products);
    console.log(`Seeded ${insertedProducts.length} product(s).`);

    const productCount = await Product.countDocuments();
    console.log(`Product collection count: ${productCount}`);

    if (productCount !== products.length) {
      throw new Error(
        `Seed verification failed: expected ${products.length} products but found ${productCount}`
      );
    }

    console.log("Product seed completed successfully.");
  } catch (error) {
    console.error("Product seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB.");
    }
  }
}

await seedProducts();

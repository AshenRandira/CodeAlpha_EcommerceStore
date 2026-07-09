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
      "Comfortable over-ear wireless headphones with soft memory-foam cushions, clear stereo sound, and long battery life for work, travel, and everyday listening.",
    price: 24900,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    category: "Audio",
    stock: 18,
  },
  {
    name: "Nova Portable Speaker",
    description:
      "Compact Bluetooth speaker with clear sound, punchy bass, simple controls, and a portable design for indoor and outdoor listening.",
    price: 14500,
    imageUrl:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80",
    category: "Audio",
    stock: 30,
  },
  {
    name: "Echo True Wireless Earbuds",
    description:
      "Lightweight wireless earbuds with a compact charging case, touch controls, and a comfortable fit for commuting, calls, and daily listening.",
    price: 11900,
    imageUrl:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1200&q=80",
    category: "Audio",
    stock: 26,
  },
  {
    name: "Vortex Gaming Headset",
    description:
      "Over-ear gaming headset with cushioned ear cups, an adjustable microphone, and immersive sound for gaming sessions and voice chat.",
    price: 19900,
    imageUrl:
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80",
    category: "Audio",
    stock: 15,
  },
  {
    name: "Sonic Compact Soundbar",
    description:
      "Space-saving desktop soundbar designed to improve movies, music, meetings, and everyday computer audio without taking over your workspace.",
    price: 27900,
    imageUrl:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
    category: "Audio",
    stock: 10,
  },
  {
    name: "Studio USB Microphone",
    description:
      "Desktop USB microphone for voice calls, streaming, podcasts, and content creation with simple plug-and-play computer connectivity.",
    price: 18500,
    imageUrl:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
    category: "Audio",
    stock: 14,
  },
  {
    name: "Vertex Mechanical Keyboard",
    description:
      "Compact mechanical keyboard with tactile switches, durable keycaps, and a clean layout designed for productive work and gaming setups.",
    price: 18500,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 24,
  },
  {
    name: "Glide Wireless Mouse",
    description:
      "Comfortable wireless mouse with responsive tracking, quiet controls, and a lightweight shape suited to everyday productivity.",
    price: 7500,
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 28,
  },
  {
    name: "Orbit USB-C Hub",
    description:
      "Versatile USB-C hub that expands a single port with practical connections for displays, storage devices, accessories, and charging.",
    price: 9500,
    imageUrl:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 35,
  },
  {
    name: "Focus HD Webcam",
    description:
      "Full HD webcam designed for clear video calls, online classes, and remote meetings with a compact monitor-friendly design.",
    price: 16900,
    imageUrl:
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 14,
  },
  {
    name: "Atlas Laptop Stand",
    description:
      "Adjustable laptop stand that raises your screen for a more comfortable workspace while keeping the desk organized and ventilated.",
    price: 6900,
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 22,
  },
  {
    name: "Flux Portable SSD",
    description:
      "Compact portable solid-state drive for quick backups, project files, photos, and everyday storage across compatible computers and devices.",
    price: 28900,
    imageUrl:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 13,
  },
  {
    name: "Halo Monitor Light Bar",
    description:
      "Slim monitor-mounted light bar that adds comfortable desk lighting without taking up valuable workspace beside your keyboard and mouse.",
    price: 13900,
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 17,
  },
  {
    name: "Swift Wireless Presenter",
    description:
      "Compact wireless presenter with simple slide controls for classrooms, meetings, demonstrations, and professional presentations.",
    price: 6500,
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    category: "Computer Accessories",
    stock: 20,
  },
  {
    name: "Volt 20000mAh Power Bank",
    description:
      "High-capacity portable power bank for keeping phones and other compatible devices charged while commuting, travelling, or working away from a desk.",
    price: 8500,
    imageUrl:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80",
    category: "Mobile Accessories",
    stock: 32,
  },
  {
    name: "Arc 65W GaN Charger",
    description:
      "Compact multi-device wall charger designed for efficient charging of compatible phones, tablets, and lightweight laptops.",
    price: 12500,
    imageUrl:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80",
    category: "Mobile Accessories",
    stock: 25,
  },
  {
    name: "Dock Magnetic Phone Stand",
    description:
      "Minimal magnetic phone stand for desks and bedside tables with an adjustable viewing angle for calls, videos, and notifications.",
    price: 7900,
    imageUrl:
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=1200&q=80",
    category: "Mobile Accessories",
    stock: 21,
  },
  {
    name: "Link Braided USB-C Cable",
    description:
      "Durable braided USB-C cable for everyday charging and data connections with reinforced ends designed for regular use.",
    price: 2900,
    imageUrl:
      "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&fit=crop&w=1200&q=80",
    category: "Mobile Accessories",
    stock: 48,
  },
  {
    name: "Pulse Smartwatch",
    description:
      "Lightweight smartwatch with activity tracking, notification support, heart-rate monitoring, and an all-day battery for an active lifestyle.",
    price: 32900,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    category: "Wearables",
    stock: 12,
  },
  {
    name: "Motion Fitness Band",
    description:
      "Slim fitness band with daily activity tracking, workout support, sleep insights, and a lightweight design for regular wear.",
    price: 13500,
    imageUrl:
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?auto=format&fit=crop&w=1200&q=80",
    category: "Wearables",
    stock: 19,
  },
  {
    name: "Luma LED Desk Lamp",
    description:
      "Minimal LED desk lamp with adjustable positioning and comfortable task lighting for study desks, workspaces, and reading areas.",
    price: 8900,
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    category: "Home Office",
    stock: 16,
  },
  {
    name: "Canvas XL Desk Mat",
    description:
      "Large desk mat that creates a smooth surface for keyboards and mice while helping protect and organize a modern workspace.",
    price: 4500,
    imageUrl:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
    category: "Home Office",
    stock: 27,
  },
  {
    name: "Atlas Everyday Backpack",
    description:
      "Practical everyday backpack with a spacious main compartment, comfortable shoulder straps, and organized storage for work or university.",
    price: 12900,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    category: "Bags",
    stock: 20,
  },
  {
    name: "Nomad Tech Organizer",
    description:
      "Compact organizer for cables, chargers, adapters, memory cards, and other everyday accessories that need a dedicated place in your bag.",
    price: 5500,
    imageUrl:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=80",
    category: "Bags",
    stock: 24,
  },
];

function validateSeedData() {
  const productNames = products.map((product) => product.name);
  const uniqueProductNames = new Set(productNames);

  if (uniqueProductNames.size !== productNames.length) {
    throw new Error(
      "Seed data contains duplicate product names.",
    );
  }

  for (const product of products) {
    if (
      !Number.isInteger(product.price) ||
      product.price <= 0
    ) {
      throw new Error(
        `Invalid LKR price for "${product.name}".`,
      );
    }

    if (
      !Number.isInteger(product.stock) ||
      product.stock < 0
    ) {
      throw new Error(
        `Invalid stock value for "${product.name}".`,
      );
    }
  }
}

async function seedProducts() {
  try {
    validateSeedData();

    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from server/.env",
      );
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const deleteResult = await Product.deleteMany({});

    console.log(
      `Cleared ${deleteResult.deletedCount} existing product(s).`,
    );

    const insertedProducts =
      await Product.insertMany(products);

    console.log(
      `Seeded ${insertedProducts.length} product(s).`,
    );

    const productCount =
      await Product.countDocuments();

    console.log(
      `Product collection count: ${productCount}`,
    );

    if (productCount !== products.length) {
      throw new Error(
        `Seed verification failed: expected ${products.length} products but found ${productCount}.`,
      );
    }

    console.log(
      "Product seed completed successfully.",
    );
  } catch (error) {
    console.error(
      "Product seed failed:",
      error.message,
    );

    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB.");
    }
  }
}

await seedProducts();
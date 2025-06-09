// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { PrismaNeon } from '@prisma/adapter-neon';
// import { PrismaClient } from '@prisma/client';
// import ws from 'ws';

// // Sets up WebSocket connections, which enables Neon to use WebSocket communication.
// neonConfig.webSocketConstructor = ws;
// const connectionString = `${process.env.DATABASE_URL}`;

// // Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
// const pool = new Pool({ connectionString });

// // Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
// const adapter = new PrismaNeon(pool);

// // Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
// export const prisma = new PrismaClient({ adapter }).$extends({
//   result: {
//     product: {
//       price: {
//         compute(product) {
//           return product.price.toString();
//         },
//       },
//       rating: {
//         compute(product) {
//           return product.rating.toString();
//         },
//       },
//     },
//   },
// });

// import { Pool } from "@neondatabase/serverless";
// import { PrismaClient } from "@prisma/client";
// import ws from "ws";
// import { neonConfig } from "@neondatabase/serverless";

// // Set up WebSocket connections for Neon
// neonConfig.webSocketConstructor = ws;

// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//   throw new Error("DATABASE_URL is missing.");
// }

// // Creates a new connection pool using Neon’s serverless driver
// const pool = new Pool({ connectionString });

// // Initializes Prisma **without** using PrismaNeon (since it's not an actual Prisma adapter)
// export const prisma = new PrismaClient().$extends({
//   result: {
//     product: {
//       price: {
//         compute: (product) => product.price.toString(),
//       },
//       rating: {
//         compute: (product) => product.rating.toString(),
//       },
//     },
//   },
// });


import { Pool } from "@neondatabase/serverless";
import { PrismaClient } from "@prisma/client";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";

// Configure Neon to use WebSockets for communication
neonConfig.webSocketConstructor = ws;

// Validate the environment variable
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Please set it in your environment variables.");
}

// Initialize connection pool for direct queries (if needed)
const pool = new Pool({ connectionString });

// Function to verify database connection (optional but useful for debugging)
async function checkDatabaseConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT NOW()");
    console.log("Database connected. Server time:", res.rows[0].now);
    client.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

// Initialize Prisma Client
export const prisma = new PrismaClient().$extends({
  result: {
    product: {
      price: {
        compute: (product) => product.price.toString(),
      },
      rating: {
        compute: (product) => product.rating.toString(),
      },
    },
  },
});

// Perform the database connection check (remove in production)
checkDatabaseConnection();


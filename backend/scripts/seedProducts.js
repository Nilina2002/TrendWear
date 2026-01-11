import dotenv from 'dotenv';
import connectToDatabase from '../db/db.js';
import Product from '../models/Product.js';
import { demoProducts } from '../data/demoProducts.js';

dotenv.config();

const seedProducts = async () => {
    try {
        await connectToDatabase();
        console.log('Connected to database');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        const productsWithStock = demoProducts.map(product => ({
            ...product,
            stock: Math.floor(Math.random() * 91) + 10
        }));

        const insertedProducts = await Product.insertMany(productsWithStock);
        console.log(`Successfully seeded ${insertedProducts.length} products`);

        const menCount = insertedProducts.filter(p => p.category === 'Men').length;
        const womenCount = insertedProducts.filter(p => p.category === 'Women').length;
        const kidsCount = insertedProducts.filter(p => p.category === 'Kids').length;

        console.log('\nProduct Summary:');
        console.log(`Men's Products: ${menCount}`);
        console.log(`Women's Products: ${womenCount}`);
        console.log(`Kids' Products: ${kidsCount}`);
        console.log(`Total Products: ${insertedProducts.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();

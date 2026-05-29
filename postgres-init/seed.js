const { faker } = require("@faker-js/faker");
const fs = require("fs");

const TOTAL_PRODUCTS = 50000;

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Sports",
  "Beauty",
  "Toys",
  "Automotive",
];

let sql = "";

for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
  const sku = faker.string.uuid();
  const name = faker.commerce.productName();
  const description = faker.commerce.productDescription();
  const category =
    categories[Math.floor(Math.random() * categories.length)];
  const price = faker.commerce.price();

  sql += `
  INSERT INTO products 
  (sku, name, description, category, price)
  VALUES
  (
    '${sku.replace(/'/g, "''")}',
    '${name.replace(/'/g, "''")}',
    '${description.replace(/'/g, "''")}',
    '${category.replace(/'/g, "''")}',
    ${price}
  );
  `;
}

fs.writeFileSync("postgres-init/seed.sql", sql);

console.log("seed.sql generated successfully");
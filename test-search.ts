import { searchSensaProducts, getSensaProducts } from './src/app/actions/sensaProductActions';

async function main() {
  const products = await getSensaProducts();
  if (products.data && products.data.length > 0) {
    console.log("Columns:", Object.keys(products.data[0]).join(", "));
  }
}

main().catch(console.error);

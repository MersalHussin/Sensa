import { searchSensaProducts, getSensaProducts } from "../actions/sensaProductActions";
import ProductsClientPage from "./ProductsClientPage";

// Depending on the Next.js version, searchParams can be an async promise or a plain object.
// We handle both gracefully by awaiting it just in case (Next.js 15+).
export default async function ProductsPage(props: { searchParams: Promise<any> | any }) {
  // Await searchParams in case this is Next.js 15 (which requires it). In 14 and below, it's a synchronous object but awaiting it doesn't hurt.
  const searchParams = await (props.searchParams || {});
  
  const query = typeof searchParams.search === 'string' ? searchParams.search : "";
  
  let products = [];
  if (query) {
    // limit 0 means no limit
    const res = await searchSensaProducts(query, 0);
    if (res.success) {
      products = res.data || [];
    }
  } else {
    const res = await getSensaProducts();
    if (res.success) {
      products = res.data || [];
    }
  }

  return <ProductsClientPage initialProducts={products} query={query} />;
}

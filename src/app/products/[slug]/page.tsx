import { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockProducts } from "../data";
import ProductClient from "./ProductClient";
import { supabaseServer } from "../../lib/supabaseServer";
import { getAcceptedReviews } from "../../actions/reviewActions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: supabaseProduct } = await supabaseServer
    .from("sensa_products")
    .select("*")
    .eq("slug", slug)
    .single();

  const product = supabaseProduct || mockProducts.find(p => p.slug === slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name_en} | Le Visage Plus`,
    description: product.description_en,
    openGraph: {
      title: `${product.name_en} | Le Visage Plus`,
      description: product.description_en,
      images: [product.images?.[0] || "/images/visageProducts.png"],
    },
  };
}

export default async function SensaProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Try fetching from Supabase first
  const { data: supabaseProduct, error } = await supabaseServer
    .from("sensa_products")
    .select("*")
    .eq("slug", slug)
    .single();

  // Fetch related products (excluding the current one)
  const { data: relatedSupabaseProducts } = await supabaseServer
    .from("sensa_products")
    .select("*")
    .neq("slug", slug)
    .limit(4);

  // Fallback to mock data if not found in DB
  const product = supabaseProduct || mockProducts.find(p => p.slug === slug);
  const relatedProducts = relatedSupabaseProducts || mockProducts.filter(p => p.slug !== slug).slice(0, 4);

  if (!product) {
    notFound();
  }

  const reviewsRes = await getAcceptedReviews(slug);
  const reviews = reviewsRes.success ? reviewsRes.data : [];

  return <ProductClient product={product} relatedProducts={relatedProducts} initialReviews={reviews} />;
}


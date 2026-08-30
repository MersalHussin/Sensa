"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { submitReview } from "../../actions/reviewActions";
import { Turnstile } from "@marsidev/react-turnstile";

export default function ProductClient({ product, relatedProducts = [], initialReviews = [] }: { product: any, relatedProducts?: any[], initialReviews?: any[] }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [selectedImage, setSelectedImage] = useState<string>(product.images?.[0] || "/placeholder.png");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [submitCount, setSubmitCount] = useState(0);
  const turnstileRef = useRef<any>(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    if (submitCount >= 3) {
      alert(isArabic ? "لقد وصلت للحد الأقصى للتقييمات. يرجى تحديث الصفحة للمحاولة مرة أخرى." : "Maximum reviews reached. Please refresh the page to try again.");
      return;
    }
    
    if (!turnstileToken) {
      alert(isArabic ? "يرجى إكمال التحقق الأمني أولاً" : "Please complete the security check first");
      return;
    }

    setIsSubmitting(true);
    const res = await submitReview({
      product_id: product.slug || product.id,
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment
    }, turnstileToken);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitSuccess(true);
      setSubmitCount(prev => prev + 1);
      setReviewName("");
      setReviewRating(5);
      setReviewComment("");
      setTurnstileToken("");
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    } else {
      alert(isArabic ? "حدث خطأ أثناء الإرسال" : "An error occurred while submitting");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[#F8FAFF] pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumb
          homeHref="/"
          theme="sensa"
          items={[
            { label: isArabic ? "المنتجات" : "Products", href: "/#products" },
            { label: isArabic ? product.name_ar : product.name_en },
          ]}
          className="mb-8 !bg-transparent !border-none !px-0"
        />
      </div>

      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="w-full lg:sticky lg:top-32 space-y-4">
          <div className="w-full aspect-square relative rounded-[2rem] overflow-hidden bg-white shadow-xl border border-gray-100">
            <Image 
              src={selectedImage} 
              alt={isArabic ? product.name_ar : product.name_en}
              fill
              className="object-cover transition-opacity duration-300"
            />
            {product.best_selling && (
              <span className={`absolute top-6 ${isArabic ? 'right-6' : 'left-6'} bg-main text-white px-4 py-2 rounded-full font-bold text-sm shadow-md z-20`}>
                {isArabic ? "الأكثر مبيعاً" : "Best Seller"}
              </span>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`cursor-pointer relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === img 
                      ? "border-main shadow-lg scale-101" 
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${isArabic ? product.name_ar : product.name_en} - thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 pt-4">
          <div className="text-sm font-bold text-main uppercase tracking-widest">
            {product.category?.join(" • ") || ""}
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            {isArabic ? product.name_ar : product.name_en}
          </h1>
          
          {(isArabic ? product.tagline_ar : product.tagline_en) && (
            <h2 className="text-xl text-gray-500 font-medium leading-snug">
              {isArabic ? product.tagline_ar : product.tagline_en}
            </h2>
          )}

          <div className="h-px w-full bg-gray-200 my-6" />

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {isArabic ? product.description_ar : product.description_en}
          </p>

          <div className="space-y-6 pt-4">
            {(isArabic ? product.usage_ar : product.usage_en) && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {isArabic ? "طريقة الاستخدام" : "How to Use"}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {isArabic ? product.usage_ar : product.usage_en}
                </p>
              </div>
            )}

            {(isArabic ? product.ingredients_ar : product.ingredients_en) && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {isArabic ? "المكونات الرئيسية" : "Key Ingredients"}
                </h3>
                <div className="flex flex-wrap gap-3 mt-3">
                  {((isArabic ? product.ingredients_ar : product.ingredients_en) || []).map((ing: string, idx: number) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-white border border-gray-100 text-gray-700 text-sm md:text-base font-medium rounded-xl hover:bg-gray-100 hover:border-gray-200 transition-colors" 
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.volume && (
              <div className="pt-2">
                <span className="font-semibold text-gray-900">
                  {isArabic ? "الحجم: " : "Volume: "}
                </span>
                <span className="text-gray-600">{product.volume}</span>
              </div>
            )}
          </div>

          {/* Online Stores */}
          {product.stores && product.stores.length > 0 && (
            <div className="pt-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                {isArabic ? "متوفر في:" : "Available at:"}
              </h3>
              <div className="flex flex-wrap gap-4">
                {product.stores.map((store: any, idx: number) => {
                  return (
                    <a
                      key={idx}
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden inline-flex items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(14,77,56,0.1)] hover:border-main/30 transition-all duration-500 hover:-translate-y-1 min-w-[220px]"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${isArabic ? 'from-transparent via-main/5 to-transparent translate-x-[100%] group-hover:translate-x-[-100%]' : 'from-transparent via-main/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]'} transition-transform duration-700 ease-in-out`}></div>
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-main/10 transition-colors duration-300 shadow-sm border border-gray-100 group-hover:border-main/20">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-main transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <span className="font-extrabold text-gray-900 group-hover:text-main transition-colors duration-300 tracking-wide text-[15px]">
                          {store.name}
                        </span>
                      </div>

                      <div className="relative z-10 bg-gray-50 p-2 rounded-full group-hover:bg-main/10 transition-colors duration-300">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-main transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/#contact-us"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-main text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-main/30 hover:shadow-xl hover:shadow-main/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                {isArabic ? "تواصل معنا" : "Contact us now"}
              </Link>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="cursor-pointer w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-full font-bold text-lg shadow-sm hover:border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {isArabic ? "قيم المنتج" : "Rate Product"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {isArabic ? "تقييمات العملاء" : "Customer Reviews"}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-main to-[#D0DAD6] rounded-full" />
        </div>

        <div className="flex justify-end mb-4">
          <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm font-medium">
            {initialReviews?.length || 0} {isArabic ? "تقييم" : "Reviews"}
          </div>
        </div>

        {(!initialReviews || initialReviews.length === 0) ? (
          <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-200/50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-6 text-lg">
              {isArabic ? "لا توجد تقييمات حتى الآن. كن أول من يقيم هذا المنتج!" : "No reviews yet. Be the first to rate this product!"}
            </p>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-3 rounded-md font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <span className="text-yellow-400">     <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                </span>
              <span>{isArabic ? "قيم المنتج" : "Rate Product"}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initialReviews.map((review: any) => (
              <div key={review.id} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                    <span className="text-sm text-gray-400">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US') : review.date}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-32">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {isArabic ? "منتجات أخرى قد تعجبك" : "Other Products You May Like"}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-main to-[#D0DAD6] rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <div
                key={p.id || p.slug}
                className="group rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(14,77,56,0.1)] hover:border-main/30 transition-all duration-300 hover:-translate-y-2 flex flex-col"
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="block relative overflow-hidden h-[240px]"
                >
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                  <Image
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={isArabic ? p.name_ar : p.name_en}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  {p.best_selling && (
                    <div className={`absolute top-4 ${isArabic ? 'right-4' : 'left-4'} z-20`}>
                      <span className="text-xs px-3 py-1.5 rounded-full bg-main text-white font-bold shadow-md">
                        {isArabic ? "الأكثر مبيعاً" : "Best Seller"}
                      </span>
                    </div>
                  )}
                </Link>
                <div className="p-6 bg-white flex-1 flex flex-col">
                  <Link
                    href={`/products/${p.slug}`}
                    className="block space-y-3 mb-6 flex-1"
                  >
                    <h3 className="font-extrabold text-xl leading-tight group-hover:text-main transition-colors duration-300 text-gray-900">
                      {isArabic ? p.name_ar : p.name_en}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium">
                      {isArabic ? p.description_ar : p.description_en}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Add Review Modal */}
      {isReviewModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
          onClick={() => {
            setIsReviewModalOpen(false);
            setTimeout(() => setSubmitSuccess(false), 300);
          }}
        >
          <div 
            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                setIsReviewModalOpen(false);
                setTimeout(() => setSubmitSuccess(false), 300);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {isArabic ? "شكراً لك!" : "Thank You!"}
                </h3>
                <p className="text-gray-500 mb-8">
                  {isArabic ? "تم استلام تقييمك بنجاح وهو قيد المراجعة حالياً." : "Your review has been successfully submitted and is currently pending approval."}
                </p>
                <button 
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setTimeout(() => setSubmitSuccess(false), 300);
                  }}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                >
                  {isArabic ? "إغلاق" : "Close"}
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {isArabic ? "أضف تقييمك" : "Add your review"}
                </h3>
                <form className="space-y-5" onSubmit={handleReviewSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الاسم" : "Name"}
                </label>
                <input 
                  type="text" 
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-main/20 focus:border-main transition-colors bg-gray-50/50"
                  placeholder={isArabic ? "الاسم الكامل" : "Full Name"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "التقييم" : "Rating"}
                </label>
                <div className="flex gap-2">
                   {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      onClick={() => setReviewRating(i + 1)}
                      className={`w-8 h-8 cursor-pointer transition-colors ${i < reviewRating ? "text-yellow-400" : "text-gray-200 hover:text-yellow-300"}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "رأيك بالمنتج" : "Your Review"}
                </label>
                <textarea 
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-main/20 focus:border-main transition-colors resize-none bg-gray-50/50"
                  placeholder={isArabic ? "أخبرنا عن تجربتك..." : "Tell us about your experience..."}
                ></textarea>
              </div>

 

              <button 
                disabled={isSubmitting} 
                className="w-full bg-main text-white py-3.5 rounded-xl font-bold hover:bg-main/90 transition-colors shadow-lg shadow-main/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  isArabic ? "إرسال التقييم" : "Submit Review"
                )}
              </button>
                           <div className="flex flex-col items-center gap-2">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken("")}
                  onExpire={() => setTurnstileToken("")}
                />
                <p className="text-xs text-gray-400 text-center max-w-sm mt-1">
                  {isArabic ? (
                    <>هذا الموقع محمي بواسطة Cloudflare Turnstile وتطبق <a href="https://www.cloudflare.com/en-gb/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">سياسة الخصوصية</a> الخاصة بهم.</>
                  ) : (
                    <>This site is protected by Cloudflare Turnstile and their <a href="https://www.cloudflare.com/en-gb/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">Privacy Policy</a> applies.</>
                  )}
                </p>
              </div>
            </form>
            </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

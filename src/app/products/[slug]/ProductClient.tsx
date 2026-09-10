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
    <div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[#FAFAFA] pb-32 font-sans selection:bg-main selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumb
          homeHref="/"
          theme="sensa"
          items={[
            { label: isArabic ? "المجموعة" : "Collection", href: "/products" },
            { label: isArabic ? product.name_ar : product.name_en },
          ]}
          className="mb-12 !bg-transparent !border-none !px-0 uppercase tracking-widest text-xs"
        />
      </div>

      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <div className="w-full lg:col-span-5 lg:sticky lg:top-32 space-y-6">
          <div className="w-full aspect-[4/5] relative overflow-hidden bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group">
            <div className="absolute inset-0 bg-main/0 group-hover:bg-main/5 transition-colors duration-700 z-10 pointer-events-none" />
            <Image 
              src={selectedImage} 
              alt={isArabic ? product.name_ar : product.name_en}
              fill
              className="object-cover transition-transform duration-[2s] ease-out scale-100 group-hover:scale-105"
            />
            {product.best_selling && (
              <span className={`absolute top-6 ${isArabic ? 'right-6' : 'left-6'} bg-main text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase z-20 shadow-md`}>
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
                  className={`cursor-pointer relative w-20 h-24 flex-shrink-0 bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedImage === img 
                      ? "border-2 border-main shadow-lg scale-105" 
                      : "border-2 border-transparent opacity-60 hover:opacity-100"
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

        <div className="space-y-10 lg:col-span-7 pt-4 lg:pl-8 rtl:lg:pr-8 rtl:lg:pl-0">
          <div>
            <div className="text-xs font-medium text-main uppercase tracking-[0.3em] mb-4 block">
              {product.category?.join(" • ") || "COLLECTION"}
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 leading-tight uppercase tracking-wide mb-4">
              {isArabic ? product.name_ar : product.name_en}
            </h1>
            
            {(isArabic ? product.tagline_ar : product.tagline_en) && (
              <h2 className="text-lg md:text-xl text-gray-500 font-light leading-relaxed tracking-wide">
                {isArabic ? product.tagline_ar : product.tagline_en}
              </h2>
            )}

            <div className="h-px w-24 bg-main/30 my-8" />
          </div>

          <p className="text-gray-500 text-lg leading-relaxed font-light">
            {isArabic ? product.description_ar : product.description_en}
          </p>

          <div className="space-y-8 pt-4 border-t border-gray-100">
            {(isArabic ? product.usage_ar : product.usage_en) && (
              <div>
                <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-gray-900 mb-3">
                  {isArabic ? "طريقة الاستخدام" : "How to Use"}
                </h3>
                <p className="text-gray-500 leading-relaxed font-light">
                  {isArabic ? product.usage_ar : product.usage_en}
                </p>
              </div>
            )}

            {((isArabic ? product.ingredients_ar : product.ingredients_en)?.length > 0) && (
              <div>
                <h3 className="text-xs font-bold tracking-wider uppercase text-gray-900 mb-4">
                  {isArabic ? "المكونات الرئيسية" : "Key Ingredients"}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {((isArabic ? product.ingredients_ar : product.ingredients_en) || []).map((ing: string, idx: number) => (
                    <span 
                      key={idx}
                      className="px-5 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 text-sm font-medium hover:border-main/30 hover:text-main transition-colors" 
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.volume && (
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-gray-900">
                  {isArabic ? "الحجم:" : "Volume:"}
                </span>
                <span className="text-gray-500 font-light">{product.volume}</span>
              </div>
            )}
          </div>

          {/* Online Stores */}
          {product.stores && product.stores.length > 0 && (
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-xs font-bold tracking-wider uppercase text-gray-900 mb-6">
                {isArabic ? "متوفر في" : "Available At"}
              </h3>
              <div className="flex flex-wrap gap-4">
                {product.stores.map((store: any, idx: number) => {
                  return (
                    <a
                      key={idx}
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden inline-flex items-center justify-between gap-6 px-8 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-main/30 transition-all duration-500 min-w-[200px]"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-main/5 to-transparent ${isArabic ? 'translate-x-[100%] group-hover:translate-x-[-100%]' : 'translate-x-[-100%] group-hover:translate-x-[100%]'} transition-transform duration-700 ease-in-out`}></div>
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <span className="font-bold text-gray-900 group-hover:text-main transition-colors duration-500 tracking-wide text-sm">
                          {store.name}
                        </span>
                      </div>

                      <div className="relative z-10 bg-gray-50 rounded-full p-2 group-hover:bg-main/10 transition-colors duration-300">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-main transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/#contact-us"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-main text-white px-12 py-4 rounded-full font-bold tracking-wider uppercase text-sm shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              {isArabic ? "تواصل معنا" : "Contact us"}
            </Link>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="cursor-pointer w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white text-gray-900 border border-gray-200 px-10 py-4 rounded-full font-bold tracking-wider uppercase text-sm shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {isArabic ? "قيم المنتج" : "Rate Product"}
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-6 uppercase tracking-wide">
            {isArabic ? "آراء العملاء" : "Testimonials"}
          </h2>
          <div className="w-16 h-[1px] bg-main mx-auto" />
        </div>

        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
          <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-gray-500">
            {initialReviews?.length || 0} {isArabic ? "مراجعات" : "Reviews"}
          </h3>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="text-xs font-medium tracking-[0.2em] uppercase text-main hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <span>{isArabic ? "كتابة مراجعة" : "Write a review"}</span>
            <span className="text-lg leading-none">+</span>
          </button>
        </div>

        {(!initialReviews || initialReviews.length === 0) ? (
          <div className="border border-gray-100 bg-white rounded-3xl p-20 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <p className="text-gray-500 font-medium text-lg mb-8">
              {isArabic ? "كن أول من يشارك تجربته مع هذا المنتج." : "Be the first to share your experience."}
            </p>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 bg-main text-white px-10 py-4 rounded-full font-bold tracking-wider uppercase text-sm shadow-md hover:bg-main/90 hover:shadow-lg transition-all"
            >
              <span>{isArabic ? "أضف تقييمك" : "Add Review"}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialReviews.map((review: any) => (
              <div key={review.id} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-main/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-500 leading-loose font-light flex-1 italic text-lg mb-8">
                  "{review.comment}"
                </p>
                <div className="mt-auto border-t border-gray-100 pt-6">
                  <h4 className="font-medium tracking-wider text-gray-900 text-sm uppercase">{review.name}</h4>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US') : review.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-32">
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-6 uppercase tracking-wide">
              {isArabic ? "منتجات أخرى" : "You May Also Like"}
            </h2>
            <div className="w-16 h-[1px] bg-main mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map((p) => (
              <div
                key={p.id || p.slug}
                className="group flex flex-col bg-transparent h-full cursor-pointer"
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="block relative aspect-[4/5] w-full bg-white overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-500"
                >
                  <div className="absolute inset-0 bg-main/0 group-hover:bg-main/5 transition-colors duration-700 z-10 pointer-events-none" />
                  <Image
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={isArabic ? p.name_ar : p.name_en}
                    fill
                    className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  />
                  {p.best_selling && (
                    <div className="absolute top-5 rtl:right-5 ltr:left-5 z-20">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-full bg-main text-white shadow-sm">
                        {isArabic ? "الأكثر مبيعاً" : "Best Seller"}
                      </span>
                    </div>
                  )}
                </Link>
                <div className="pt-6 flex flex-col flex-grow text-center">
                  <Link
                    href={`/products/${p.slug}`}
                    className="block mb-2 flex-grow"
                  >
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 transition-colors group-hover:text-main mb-2 line-clamp-1">
                      {isArabic ? p.name_ar : p.name_en}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed px-2">
                      {isArabic ? p.description_ar : p.description_en}
                    </p>
                  </Link>
                  <div className="flex items-center justify-center mt-4 w-full">
                    <Link
                      href={`/products/${p.slug}`}
                      className="relative text-main font-bold tracking-wider uppercase text-xs hover:text-gray-900 transition-colors duration-300 overflow-hidden group/link flex items-center gap-2"
                    >
                      {isArabic ? "التفاصيل" : "Discover"}
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-main group-hover/link:bg-gray-900 transition-colors duration-300" />
                    </Link>
                  </div>
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
                  className="w-full bg-main text-white py-3.5 rounded-xl font-bold hover:bg-main/90 transition-colors shadow-lg shadow-main/20"
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

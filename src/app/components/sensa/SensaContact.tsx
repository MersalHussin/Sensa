import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaCheck } from "react-icons/fa";
import { submitContactMessage } from "../../actions/contactActions";
import { getSensaProducts } from "../../actions/sensaProductActions";
import { Turnstile } from "@marsidev/react-turnstile";

export default function SensaContact({ t, lang }: { t: any; lang: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    contact_type: "inquiry",
    product_id: "",
    product_name: "",
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [submitCount, setSubmitCount] = useState(0);
  const turnstileRef = useRef<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      const res = await getSensaProducts();
      if (res.success) {
        setProducts(res.data || []);
      }
      setLoadingProducts(false);
    };
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "product_id") {
      const selectedProduct = products.find((p) => p.id === value);
      setFormData((prev) => ({ 
        ...prev, 
        product_id: value,
        product_name: selectedProduct ? (lang === "ar" ? selectedProduct.name_ar : selectedProduct.name_en) : ""
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData((prev) => ({ ...prev, contact_type: type, product_id: "", product_name: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message)
      return;
    
    if (submitCount >= 3) {
      setSubmitError(lang === "ar" ? "لقد وصلت للحد الأقصى من المحاولات." : "Maximum attempts reached.");
      return;
    }

    if (!turnstileToken) {
      setSubmitError(lang === "ar" ? "يرجى إكمال التحقق الأمني" : "Please complete the security check");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    
    const res = await submitContactMessage(formData, turnstileToken);
    
    setIsSubmitting(false);
    
    if (res.success) {
      setSubmitted(true);
      setSubmitCount(prev => prev + 1);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ 
          name: "", email: "", phone: "", message: "", 
          contact_type: "inquiry", product_id: "", product_name: "" 
        });
        setTurnstileToken("");
        if (turnstileRef.current) {
          turnstileRef.current.reset();
        }
      }, 4000);
    } else {
      setSubmitError(lang === "ar" ? "حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً." : "An error occurred. Please try again.");
    }
  };

  const inputClass = "w-full py-4 bg-transparent border-b-2 border-gray-200 focus:border-main outline-none transition-colors text-gray-900 placeholder:text-gray-400 text-lg";

  return (
    <section id="contact-us" className="py-24 md:py-32 bg-[#F8F9F8] relative overflow-hidden">
      {/* Subtle Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-main/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-main/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Text & Contact Info Column (Left/Right depending on RTL) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-12"
          >
            <div>
              <span className="text-main uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
                {lang === "ar" ? "يسعدنا تواصلك" : "GET IN TOUCH"}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {lang === "ar" ? "تواصل معنا" : "Contact Us"}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                {lang === "ar" 
                  ? "نحن هنا لخدمتك بكل سرور. سواء كان لديك استفسار عن منتجاتنا الفاخرة، أو تحتاج إلى مساعدة خاصة، فريقنا مكرس لتقديم أفضل تجربة تليق بك." 
                  : "We are here to serve you with pleasure. Whether you have an inquiry about our luxury products or need special assistance, our team is dedicated to providing you with the best experience."}
              </p>
            </div>

            <div className="space-y-8 pt-4">
              <a href="mailto:Relation@bonnmed.com" className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:bg-main group-hover:border-main transition-all duration-300">
                  <FaEnvelope className="text-gray-400 group-hover:text-white transition-colors text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wider">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</p>
                  <p className="text-gray-900 font-bold text-xl group-hover:text-main transition-colors">Relation@bonnmed.com</p>
                </div>
              </a>
              
              <a href="tel:+966580347173" className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:bg-main group-hover:border-main transition-all duration-300">
                  <FaPhoneAlt className="text-gray-400 group-hover:text-white transition-colors text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wider">{lang === "ar" ? "رقم الهاتف" : "Phone"}</p>
                  <p className="text-gray-900 font-bold text-xl group-hover:text-main transition-colors" dir="ltr">+966 5803 47173</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* High-Contrast Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white p-10 md:p-14 rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-gray-100">
              
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <FaCheck className="text-green-500 text-3xl" />
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900 mb-4">
                    {lang === "ar" ? "شكراً لتواصلك معنا" : "Thank you for reaching out"}
                  </h4>
                  <p className="text-gray-600 text-lg">
                    {lang === "ar" ? "لقد استلمنا رسالتك وسنقوم بالرد عليك قريباً." : "We have received your message and will reply shortly."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {submitError && (
                    <div className="text-red-600 font-medium bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                      {submitError}
                    </div>
                  )}

                  {/* Type Selection */}
                  <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 mb-10">
                    <button
                      type="button"
                      onClick={() => handleTypeChange("inquiry")}
                      className={`flex-1 py-4 rounded-xl text-base font-bold transition-all ${
                        formData.contact_type === "inquiry"
                          ? "bg-white text-main shadow-sm border-gray-100"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {lang === "ar" ? "استفسار عام" : "General Inquiry"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeChange("wholesale")}
                      className={`flex-1 py-4 rounded-xl text-base font-bold transition-all ${
                        formData.contact_type === "wholesale"
                          ? "bg-white text-main shadow-sm border-gray-100"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {lang === "ar" ? "طلب جملة" : "Wholesale Order"}
                    </button>
                  </div>

                  {/* Product Select (if wholesale) */}
                  {formData.contact_type === "wholesale" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-8"
                    >
                      <select
                        name="product_id"
                        value={formData.product_id}
                        onChange={handleChange}
                        required
                        className={inputClass + " appearance-none cursor-pointer"}
                      >
                        <option value="" disabled>
                          {lang === "ar" ? "اختر المنتج..." : "Select product..."}
                        </option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {lang === "ar" ? p.name_ar : p.name_en}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.contactForm.name}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.contactForm.email}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.contactForm.phone}
                      className={inputClass + " text-left"}
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.contactForm.message}
                      rows={3}
                      className={inputClass + " resize-none pt-4"}
                    ></textarea>
                  </div>

                  <div className="flex flex-col items-center gap-6 pt-6">
                    <div className="flex flex-col items-center gap-2 w-full">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => setTurnstileToken("")}
                        onExpire={() => setTurnstileToken("")}
                      />
                
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white hover:bg-main py-5 rounded-2xl text-xl font-bold transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(14,77,56,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        t.contactForm.submit
                      )}
                    </button>
                      <p className="text-[11px] text-gray-400 text-center px-4 leading-relaxed">
                        {lang === "ar" ? (
                          <>
                            هذا الموقع محمي بواسطة Cloudflare Turnstile وتطبق <a href="https://www.cloudflare.com/en-gb/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">سياسة الخصوصية</a> الخاصة بهم.
                          </>
                        ) : (
                          <>
                            This site is protected by Cloudflare Turnstile and their <a href="https://www.cloudflare.com/en-gb/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">Privacy Policy</a> applies.
                          </>
                        )}
                      </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaClock, FaCheckCircle, FaInstagram } from "react-icons/fa";
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
      setSubmitError(lang === "ar" ? "لقد وصلت للحد الأقصى من الرسائل. يرجى تحديث الصفحة للمحاولة مرة أخرى." : "Maximum messages reached. Please refresh the page to try again.");
      return;
    }

    if (!turnstileToken) {
      setSubmitError(lang === "ar" ? "يرجى إكمال التحقق الأمني أولاً" : "Please complete the security check first");
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
      }, 3500);
    } else {
      setSubmitError(lang === "ar" ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "An error occurred. Please try again.");
    }
  };

  return (
    <section id="contact-us" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-main/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Info Column */}
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {lang === "ar" ? "تواصل معنا" : "Contact Us"}
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-main to-[#D0DAD6] rounded-full mb-6" />
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                {lang === "ar" 
                  ? "نحن هنا لخدمتك! سواء كان لديك استفسار عن منتجاتنا، أو تحتاج إلى مساعدة، لا تتردد في التواصل معنا وسيقوم فريقنا بالرد عليك في أقرب وقت." 
                  : "We are here to help! Whether you have a question about our products or need assistance, feel free to reach out and our team will get back to you shortly."}
              </p>
            </div>

            <div className="flex flex-col gap-6 pt-6 mt-8">
              <a href="mailto:Relation@bonnmed.com" className="flex items-center gap-4 text-gray-700 hover:text-main transition-colors font-bold text-lg p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-main/10 flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-main text-xl" />
                </div>
                Relation@bonnmed.com
              </a>
              <a href="tel:+966580347173" className="flex text-right items-center gap-4 text-gray-700 hover:text-main transition-colors font-bold text-lg p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full  bg-main/10 flex items-center justify-center shrink-0">
                  <FaPhone className="text-main text-xl" />
                </div>
                <span dir="ltr">
                +966 5803 47173
                </span>
              </a>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">{t.contactForm.title}</h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <FaCheckCircle className="text-green-500 text-4xl" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {lang === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message Sent Successfully!"}
                  </h4>
                  <p className="text-gray-500 font-medium">
                    {lang === "ar" ? "سنتواصل معك في أقرب وقت ممكن." : "We will get back to you as soon as possible."}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border border-red-100">
                      {submitError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">
                      {lang === "ar" ? "نوع التواصل" : "Contact Type"}
                    </label>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100/80 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => handleTypeChange('inquiry')}
                        className={`py-3.5 px-4 rounded-xl  cursor-pointer font-bold transition-all ${formData.contact_type === 'inquiry' ? 'bg-white text-main shadow-md shadow-black/5 scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                      >
                        {lang === "ar" ? "استفسار" : "Inquiry"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTypeChange('wholesale')}
                        className={`py-3.5 px-4 rounded-xl cursor-pointer font-bold transition-all ${formData.contact_type === 'wholesale' ? 'bg-white text-main shadow-md shadow-black/5 scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                      >
                        {lang === "ar" ? "طلب جملة منتج" : "Wholesale Order"}
                      </button>
                    </div>
                  </div>

                  {formData.contact_type === 'wholesale' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        {lang === "ar" ? "اختر المنتج" : "Select Product"}
                      </label>
                      <select
                        name="product_id"
                        value={formData.product_id}
                        onChange={handleChange}
                        required={formData.contact_type === 'wholesale'}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all bg-gray-50/50 font-medium appearance-none"
                      >
                        <option value="" disabled>
                          {lang === "ar" ? "--- يرجى اختيار المنتج ---" : "--- Please select a product ---"}
                        </option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {lang === "ar" ? p.name_ar : p.name_en}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t.contactForm.name}</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.contactForm.placeholder.name}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all bg-gray-50/50 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">{t.contactForm.email}</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.contactForm.placeholder.email}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all bg-gray-50/50 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">{t.contactForm.phone}</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t.contactForm.placeholder.phone}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all bg-gray-50/50 font-medium text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t.contactForm.message}</label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.contactForm.placeholder.message}
                      rows={5}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all bg-gray-50/50 font-medium resize-none"
                    ></textarea>
                  </div>

                  <div className="flex flex-col items-center gap-2">
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
                    className="w-full bg-main text-white font-bold py-4 rounded-xl hover:bg-[#0a3a2a] transition-colors shadow-lg shadow-main/30 hover:shadow-main/50 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      t.contactForm.submit
                    )}
                  </button>
                  <div className="text-center flex justify-center">

                    <p className="text-xs text-gray-400 text-center max-w-sm mt-1">
                      {lang === "ar" ? (
                        <>هذا الموقع محمي بواسطة Cloudflare Turnstile وتطبق <a href="https://www.cloudflare.com/en-gb/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">سياسة الخصوصية</a> الخاصة بهم.</>
                      ) : (
                        <>This site is protected by Cloudflare Turnstile and their <a href="https://www.cloudflare.com/en-gb/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">Privacy Policy</a> applies.</>
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

"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const { i18n } = useTranslation();
  const lang = i18n?.language === "ar" ? "ar" : "en";
  const isAr = lang === "ar";

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2A3B32] pt-32 pb-24" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#8C8374] hover:text-[#C5A059] transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
        >
          {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {isAr ? "العودة للرئيسية" : "Back to Home"}
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-main">
          {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
        </h1>
        
        <div className="space-y-8 text-lg text-[#5C6B61] leading-relaxed bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgba(197,160,89,0.06)] border border-[#E8E2D9]">
          {isAr ? (
            <>
              <p>مرحباً بك في Sensa. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيف نجمع ونستخدم ونحمي معلوماتك عند زيارة موقعنا.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">1. المعلومات التي نجمعها</h2>
              <p>قد نقوم بجمع بيانات شخصية مثل الاسم، البريد الإلكتروني، ورقم الهاتف عند التسجيل أو التواصل معنا أو إتمام عملية الشراء.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">2. كيف نستخدم معلوماتك</h2>
              <p>نستخدم معلوماتك لتقديم خدماتنا، تحسين تجربة المستخدم، معالجة الطلبات، والتواصل معك بخصوص التحديثات أو العروض.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">3. حماية البيانات</h2>
              <p>نتخذ إجراءات أمنية صارمة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح. موقعنا محمي بخدمات كابتشا متقدمة (Cloudflare Turnstile).</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">4. مشاركة المعلومات</h2>
              <p>نحن لا نبيع أو نؤجر بياناتك الشخصية لأطراف ثالثة. قد نشارك المعلومات فقط مع شركاء الخدمة الموثوقين لمساعدتنا في تشغيل الموقع.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">5. التعديلات على سياسة الخصوصية</h2>
              <p>نحتفظ بالحق في تحديث هذه السياسة في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة.</p>
            </>
          ) : (
            <>
              <p>Welcome to Sensa. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">1. Information We Collect</h2>
              <p>We may collect personal data such as your name, email address, and phone number when you register, contact us, or complete a purchase.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">2. How We Use Your Information</h2>
              <p>We use your information to provide our services, improve user experience, process orders, and communicate with you regarding updates or offers.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">3. Data Protection</h2>
              <p>We implement strict security measures to protect your data from unauthorized access, alteration, or disclosure. Our site is protected by advanced captcha services (Cloudflare Turnstile).</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">4. Sharing of Information</h2>
              <p>We do not sell or rent your personal data to third parties. We may only share information with trusted service partners to help us operate our website.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">5. Changes to Privacy Policy</h2>
              <p>We reserve the right to update this policy at any time. Any changes will be posted on this page.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

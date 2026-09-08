"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
        </h1>
        
        <div className="space-y-8 text-lg text-[#5C6B61] leading-relaxed bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgba(197,160,89,0.06)] border border-[#E8E2D9]">
          {isAr ? (
            <>
              <p>مرحباً بك في Sensa. باستخدامك لموقعنا، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">1. استخدام الموقع</h2>
              <p>يجب أن يكون استخدامك للموقع لأغراض قانونية فقط. يُمنع استخدام الموقع بأي طريقة قد تتسبب في ضرر أو تعطيل أو إعاقة لخدماتنا.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">2. المنتجات والخدمات</h2>
              <p>نحن نسعى لضمان دقة المعلومات المتعلقة بمنتجاتنا. ومع ذلك، لا نضمن خلو الموقع من الأخطاء فيما يتعلق بوصف المنتجات أو الأسعار. نحتفظ بالحق في تصحيح أي أخطاء أو تحديث المعلومات في أي وقت.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">3. الملكية الفكرية</h2>
              <p>جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص، الصور، الشعارات، والتصاميم، هي ملك لعلامة Sensa ومحمية بموجب قوانين حقوق الطبع والنشر.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">4. حدود المسؤولية</h2>
              <p>Sensa غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام أو عدم القدرة على استخدام الموقع أو المنتجات المشتراة من خلاله.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">5. التعديلات</h2>
              <p>نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. استمرارك في استخدام الموقع بعد أي تغييرات يُعد قبولاً لهذه التعديلات.</p>
            </>
          ) : (
            <>
              <p>Welcome to Sensa. By using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">1. Use of the Site</h2>
              <p>Your use of the site must be for lawful purposes only. You are prohibited from using the site in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the site.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">2. Products and Services</h2>
              <p>We strive to ensure the accuracy of the information regarding our products. However, we do not warrant that product descriptions or pricing are error-free. We reserve the right to correct any errors and update information at any time.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">3. Intellectual Property</h2>
              <p>All content on this website, including text, graphics, logos, and designs, is the property of Sensa and is protected by applicable copyright laws.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">4. Limitation of Liability</h2>
              <p>Sensa shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our site or products purchased through it.</p>
              
              <h2 className="text-2xl font-bold text-[#2A3B32] mt-8 mb-4">5. Amendments</h2>
              <p>We reserve the right to amend these Terms & Conditions at any time. Your continued use of the website following any changes constitutes your acceptance of the new terms.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

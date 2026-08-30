'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addSensaProduct, updateSensaProduct } from '@/app/actions/sensaProductActions';
import Image from 'next/image';
import { Upload, Link as LinkIcon, Trash, Info, ImageIcon, Star, Globe, Settings2, ShoppingCart } from 'lucide-react';
import TagsInput from './TagsInput';

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  
  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar');
  
  const [formData, setFormData] = useState({
    slug: initialData?.slug || '',
    name_ar: initialData?.name_ar || '',
    name_en: initialData?.name_en || '',
    tagline_ar: initialData?.tagline_ar || '',
    tagline_en: initialData?.tagline_en || '',
    description_ar: initialData?.description_ar || '',
    description_en: initialData?.description_en || '',
    usage_ar: initialData?.usage_ar || '',
    usage_en: initialData?.usage_en || '',
    volume: initialData?.volume || '',
    best_selling: initialData?.best_selling || false,
    ingredients_ar: initialData?.ingredients_ar || [],
    ingredients_en: initialData?.ingredients_en || [],
    category: initialData?.category || [],
    images: initialData?.images || [],
    stores: initialData?.stores || [],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData({ ...formData, images: [...formData.images, imageUrlInput.trim()] });
      setImageUrlInput('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const addStore = () => {
    setFormData(prev => ({
      ...prev,
      stores: [...prev.stores, { name: '', url: '' }]
    }));
  };

  const updateStore = (index: number, field: 'name' | 'url', value: string) => {
    const newStores = [...formData.stores];
    newStores[index][field] = value;
    setFormData(prev => ({ ...prev, stores: newStores }));
  };

  const removeStore = (index: number) => {
    const newStores = [...formData.stores];
    newStores.splice(index, 1);
    setFormData(prev => ({ ...prev, stores: newStores }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('إعدادات Cloudinary مفقودة');
      return;
    }

    setUploadingImage(true);
    
    const formDataObj = new FormData();
    formDataObj.append('file', file);
    formDataObj.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formDataObj,
      });
      const data = await res.json();
      
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, images: [...prev.images, data.secure_url] }));
      } else {
        setError('فشل رفع الصورة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      let res;
      if (initialData?.id) {
        res = await updateSensaProduct(initialData.id, formData);
      } else {
        res = await addSensaProduct(formData);
      }

      if (res?.success) {
        router.push('/admin');
      } else {
        setError(res?.error || 'حدث خطأ غير متوقع');
      }
    });
  };
  
  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="space-y-8" dir="rtl">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100 shadow-sm flex items-center gap-3">
          <Info size={20} />
          {error}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
          <div className="bg-gray-100 p-2 rounded-lg text-gray-700">
            <Settings2 size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">إعدادات عامة (مشتركة)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex flex-col md:flex-row md:items-end gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">رابط المنتج (Slug) <span className="text-red-500">*</span></label>
              <input 
                type="text" name="slug" value={formData.slug} onChange={handleInputChange} required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 outline-none transition-all placeholder:text-gray-400"
                dir="ltr" placeholder="anti-aging-cream"
              />
            </div>
            <div className="flex items-center shrink-0 mb-3">
              <label className="flex items-center cursor-pointer group">
                <input 
                  type="checkbox" name="best_selling" checked={formData.best_selling} onChange={handleInputChange}
                  className="peer sr-only"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-main relative ml-3"></div>
                <span className="font-bold text-gray-700 group-hover:text-main transition-colors flex items-center gap-1.5">
                  <Star size={16} className={formData.best_selling ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} />
                  منتج الأكثر مبيعاً
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">الحجم (Volume)</label>
            <input 
              type="text" name="volume" value={formData.volume} onChange={handleInputChange}
              placeholder="مثال: 50ml"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 focus:bg-white h-[50px]" dir="ltr"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">التصنيفات</label>
            <TagsInput 
              tags={formData.category} 
              onChange={(tags) => setFormData({ ...formData, category: tags })} 
              placeholder="مثال: العناية بالبشرة" 
            />
          </div>
        </div>
      </div>

      {/* Localized Details Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">تفاصيل المنتج</h2>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveLang('ar')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeLang === 'ar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeLang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              dir="ltr"
            >
              English
            </button>
          </div>
        </div>

        <div>
          {/* Arabic Fields */}
          <div className={`space-y-6 transition-all duration-300 ${activeLang === 'ar' ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الاسم (عربي) <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="name_ar" value={formData.name_ar} onChange={handleInputChange} required={activeLang === 'ar'}
                  placeholder="مثال: كريم تفتيح البشرة"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">شعار / Tagline (عربي)</label>
                <input 
                  type="text" name="tagline_ar" value={formData.tagline_ar} onChange={handleInputChange}
                  placeholder="مثال: لبشرة نضرة ومشرقة"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">الوصف (عربي)</label>
              <textarea 
                name="description_ar" value={formData.description_ar} onChange={handleInputChange} rows={4}
                placeholder="اكتب وصفاً مفصلاً للمنتج..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 resize-y bg-gray-50/50 focus:bg-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">طريقة الاستخدام (عربي)</label>
              <textarea 
                name="usage_ar" value={formData.usage_ar} onChange={handleInputChange} rows={3}
                placeholder="اشرح كيفية الاستخدام..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 resize-y bg-gray-50/50 focus:bg-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">المكونات (عربي)</label>
              <p className="text-xs text-gray-500 mb-2">اضغط Enter أو فاصلة (,) لإضافة مكون جديد</p>
              <TagsInput 
                tags={formData.ingredients_ar} 
                onChange={(tags) => setFormData({ ...formData, ingredients_ar: tags })} 
                placeholder="مثال: حمض الهيالورونيك، فيتامين سي" 
              />
            </div>
          </div>

          {/* English Fields */}
          <div dir="ltr" className={`space-y-6 transition-all duration-300 ${activeLang === 'en' ? 'block animate-in fade-in slide-in-from-left-4' : 'hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-left">Name (English) <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="name_en" value={formData.name_en} onChange={handleInputChange} required={activeLang === 'en'}
                  placeholder="e.g. Skin Whitening Cream"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 focus:bg-white text-left"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-left">Tagline (English)</label>
                <input 
                  type="text" name="tagline_en" value={formData.tagline_en} onChange={handleInputChange}
                  placeholder="e.g. For radiant and glowing skin"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 focus:bg-white text-left"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-left">Description (English)</label>
              <textarea 
                name="description_en" value={formData.description_en} onChange={handleInputChange} rows={4}
                placeholder="Write a detailed product description..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 resize-y bg-gray-50/50 focus:bg-white text-left"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-left">How to Use (English)</label>
              <textarea 
                name="usage_en" value={formData.usage_en} onChange={handleInputChange} rows={3}
                placeholder="Explain how to use..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 resize-y bg-gray-50/50 focus:bg-white text-left"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-left">Ingredients (English)</label>
              <p className="text-xs text-gray-500 mb-2 text-left">Press Enter or comma (,) to add an ingredient</p>
              <TagsInput 
                tags={formData.ingredients_en} 
                onChange={(tags) => setFormData({ ...formData, ingredients_en: tags })} 
                placeholder="e.g. Hyaluronic Acid, Vitamin C" 
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stores Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 mt-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
          <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
            <ShoppingCart size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">المتاجر الأونلاين</h2>
        </div>
        
        <div className="space-y-4">
          {formData.stores.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
              لا توجد متاجر مضافة حالياً. اضغط على الزر أدناه لإضافة متجر.
            </div>
          )}
          
          {formData.stores.map((store: any, idx: number) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 items-start sm:items-center">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-500 mb-1">اسم المتجر (مثال: Amazon, Noon)</label>
                <input 
                  type="text" 
                  value={store.name} 
                  onChange={(e) => updateStore(idx, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
                  placeholder="اسم المتجر"
                />
              </div>
              <div className="flex-[2] w-full">
                <label className="block text-xs font-semibold text-gray-500 mb-1">رابط المنتج</label>
                <input 
                  type="url" 
                  value={store.url} 
                  onChange={(e) => updateStore(idx, 'url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
              <button 
                type="button" 
                onClick={() => removeStore(idx)}
                className="mt-5 p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0 self-end sm:self-auto"
                title="حذف المتجر"
              >
                <Trash size={20} />
              </button>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addStore}
            className="mt-4 px-5 py-2.5 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-xl font-bold transition-colors text-sm flex items-center gap-2"
          >
            <LinkIcon size={16} /> إضافة متجر جديد
          </button>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 mt-20">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
          <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
            <ImageIcon size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">صور المنتج</h2>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          {formData.images.length === 0 && (
            <div className="w-full p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
              <ImageIcon size={40} className="mb-2 opacity-50" />
              <p>لم يتم إضافة أي صور بعد</p>
            </div>
          )}
          {formData.images.map((img: string, idx: number) => (
            <div key={idx} className="relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-200 group shadow-sm bg-gray-50">
              <Image src={img} alt={`Image ${idx}`} fill className="object-cover" />
              <button 
                type="button" 
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <Trash size={24} className="text-red-400 hover:text-red-500 transition-colors transform group-hover:scale-110 duration-200" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-purple-50/30 rounded-2xl border border-purple-100/50">
          <div>
            <label className="block text-gray-700 font-semibold mb-3">إضافة رابط صورة</label>
            <div className="flex gap-2">
              <input 
                type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400 bg-white"
                placeholder="https://example.com/image.jpg" dir="ltr"
              />
              <button 
                type="button" onClick={addImageUrl}
                className="bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-gray-800 flex items-center gap-2 transition-colors font-semibold shadow-sm shrink-0"
              >
                <LinkIcon size={18} /> إضافة
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-3">أو رفع صورة من الجهاز</label>
            <div className="relative w-full h-[52px]">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
              />
              <div className={`absolute inset-0 w-full h-full px-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-3 transition-colors font-semibold ${uploadingImage ? 'border-gray-300 bg-gray-100 text-gray-400' : 'border-purple-300 bg-white text-purple-700 hover:bg-purple-50 hover:border-purple-400'}`}>
                {uploadingImage ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></span>
                    جاري الرفع...
                  </span>
                ) : (
                  <>
                    <Upload size={18} />
                    اختر صورة لرفعها
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 mt-8 gap-4 sticky bottom-6 z-40 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        <button 
          type="button" onClick={() => router.back()}
          className="px-8 py-3.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors shadow-sm"
        >
          إلغاء
        </button>
        <button 
          type="submit" disabled={isPending}
          className="px-10 py-3.5 bg-main text-white rounded-xl font-bold shadow-md shadow-main/20 hover:bg-main/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
        >
          {isPending && (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          )}
          {isPending ? 'جاري الحفظ...' : 'حفظ المنتج'}
        </button>
      </div>
    </form>
  );
}

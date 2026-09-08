'use server';

import { supabaseServer } from '../lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function submitReview(data: any, turnstileToken?: string) {
  try {
    if (!turnstileToken) {
      return { success: false, error: "رمز الكابتشا مفقود" };
    }

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: turnstileToken,
      }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return { success: false, error: "فشل التحقق الأمني" };
    }

    const { data: review, error } = await supabaseServer
      .from('product_reviews_sensa')
      .insert([
        {
          ...data,
          status: 'pending',
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    // We can revalidate admin reviews so it shows up instantly for admin
    revalidatePath('/admin/reviews');
    
    return { success: true, data: review };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAcceptedReviews(productId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('product_reviews_sensa')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllReviews() {
  try {
    const { data, error } = await supabaseServer
      .from('product_reviews_sensa')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReviewStatus(id: string, status: 'accepted' | 'rejected' | 'paused' | 'pending') {
  try {
    const { data: review, error } = await supabaseServer
      .from('product_reviews_sensa')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin/reviews');
    // We should also revalidate products since this might be accepted
    if (review?.product_id) {
      revalidatePath(`/products/${review.product_id}`);
    }
    
    return { success: true, data: review };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

'use server';

import { supabaseServer } from '../lib/supabaseServer';

export async function submitContactMessage(data: any, turnstileToken?: string) {
  try {
    if (!turnstileToken) {
      return { success: false, error: "رمز الكابتشا مفقود" };
    }

    // Verify with Cloudflare server
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

    const { data: message, error } = await supabaseServer
      .from('contact_messages_sensa')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, data: message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getContactMessages() {
  try {
    const { data, error } = await supabaseServer
      .from('contact_messages_sensa')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

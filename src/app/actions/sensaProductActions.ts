'use server';

import { supabaseServer } from '../lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function getSensaProducts() {
  try {
    const { data, error } = await supabaseServer
      .from('levisage_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSensaProduct(id: string) {
  try {
    const { data, error } = await supabaseServer
      .from('levisage_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addSensaProduct(data: any) {
  try {
    const { data: product, error } = await supabaseServer
      .from('levisage_products')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin', 'layout');
    revalidatePath('/products', 'page');
    
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSensaProduct(id: string, data: any) {
  try {
    const { data: product, error } = await supabaseServer
      .from('levisage_products')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin', 'layout');
    revalidatePath('/products', 'page');
    
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSensaProduct(id: string) {
  try {
    const { error } = await supabaseServer
      .from('levisage_products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath('/admin', 'layout');
    revalidatePath('/products', 'page');
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function searchSensaProducts(query: string, limit: number = 5) {
  try {
    const normalizedQuery = query.replace(/[أإآا]/g, '_');
    
    let dbQuery = supabaseServer
      .from('levisage_products')
      .select('id, name_en, name_ar, slug, images, description_en, description_ar, best_selling')
      .or(`name_en.ilike.%${normalizedQuery}%,name_ar.ilike.%${normalizedQuery}%,description_en.ilike.%${normalizedQuery}%,description_ar.ilike.%${normalizedQuery}%`);
      
    if (limit > 0) {
      dbQuery = dbQuery.limit(limit);
    }

    const { data, error } = await dbQuery;

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

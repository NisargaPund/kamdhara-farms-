import { supabase } from './supabase';
import type { Address, SavedAddress } from '../types';

export async function getUserAddresses(userId: string): Promise<SavedAddress[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAddress(
  userId: string,
  address: Omit<SavedAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<SavedAddress> {
  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...address, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAddress(
  addressId: string,
  updates: Partial<Omit<SavedAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<SavedAddress> {
  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', addressId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAddress(addressId: string): Promise<void> {
  const { error } = await supabase.from('addresses').delete().eq('id', addressId);
  if (error) throw error;
}

export function savedAddressToShipping(address: SavedAddress): Address {
  return {
    full_name: address.full_name,
    phone: address.phone,
    address_line1: address.address_line1,
    address_line2: address.address_line2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
  };
}

export const emptyAddressForm = (): Omit<SavedAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'> => ({
  label: 'Home',
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  pincode: '',
  is_default: false,
});

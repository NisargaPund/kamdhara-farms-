export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  image_url: string;
  gallery_urls: string[];
  benefits: string[];
  nutrition_info: Record<string, string>;
  featured: boolean;
  apply_gst: boolean;
  gst_rate: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  product_slug: string;
  size: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  coupon_code: string | null;
  payment_method: string;
  shipping_address: Address;
  billing_address?: Address;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  size: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockCount: number;
  totalCustomers: number;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  image_url: string;
  gallery_urls: string[];
  benefits: string[];
  featured: boolean;
  apply_gst: boolean;
  gst_rate: number;
  variants: { id?: string; size: string; price: number; stock: number }[];
}

export interface Address {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  user_name: string;
}

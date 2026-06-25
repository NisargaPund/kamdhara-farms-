import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, X, Star, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  slugify,
} from '../../lib/admin';
import { useAuth } from '../../lib/auth';
import { formatStorageUploadError, STORAGE_MIGRATION_HINT, uploadProductImage } from '../../lib/storage';
import { useAdmin } from '../../lib/useAdmin';
import { formatPrice } from '../../lib/utils';
import { formatBottleLabel } from '../../lib/variants';
import ProductImage from '../../components/product/ProductImage';
import { getDisplayPrice } from '../../lib/gst';
import type { Product, ProductFormData, ProductVariant } from '../../types';

const CATEGORIES = ['A2 Ghee', 'Cow Ghee', 'Buffalo Ghee'];

function getSaveErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const err = error as { message?: string; details?: string; hint?: string; code?: string };
    if (err.message) {
      return [err.message, err.details, err.hint].filter(Boolean).join(' — ');
    }
  }
  if (error instanceof Error) return error.message;
  return 'Failed to save product';
}

const emptyForm: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  short_description: '',
  category: 'A2 Ghee',
  image_url: '',
  gallery_urls: [],
  benefits: [''],
  featured: false,
  apply_gst: false,
  gst_rate: 5,
  variants: [{ size: '500ml', price: 0, stock: 0, image_url: '' }],
};

export default function AdminProductsPage() {
  const { user, session } = useAuth();
  const { isAdmin } = useAdmin();
  const [products, setProducts] = useState<(Product & { product_variants: ProductVariant[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [variantImageUploading, setVariantImageUploading] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const variantFileInputRef = useRef<HTMLInputElement>(null);
  const variantUploadIndexRef = useRef<number>(0);

  const loadProducts = async () => {
    try {
      setProducts(await getAdminProducts());
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (product: Product & { product_variants: ProductVariant[] }) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.short_description,
      category: product.category,
      image_url: product.image_url,
      gallery_urls: Array.isArray(product.gallery_urls) ? [...product.gallery_urls] : [],
      benefits: Array.isArray(product.benefits) && product.benefits.length
        ? [...product.benefits]
        : [''],
      featured: product.featured,
      apply_gst: product.apply_gst ?? false,
      gst_rate: product.gst_rate ?? 5,
      variants: product.product_variants.map((v) => ({
        id: v.id,
        size: v.size,
        price: v.price,
        stock: v.stock,
        image_url: v.image_url || '',
      })),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!form.slug.trim()) {
      setForm((f) => ({ ...f, slug: slugify(f.name) }));
    }

    setSaving(true);
    try {
      const data = { ...form, slug: form.slug || slugify(form.name) };
      if (editingId) {
        const existing = products.find((p) => p.id === editingId);
        await updateProduct(
          editingId,
          data,
          existing?.product_variants.map((v) => v.id) || []
        );
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      setShowForm(false);
      await loadProducts();
    } catch (error) {
      const message = getSaveErrorMessage(error);
      toast.error(message);
      console.error('Save product error:', error);
      if (message.toLowerCase().includes('apply_gst') || message.toLowerCase().includes('column')) {
        toast('Run fix_missing_product_columns.sql in Supabase SQL Editor', {
          duration: 8000,
          icon: 'ℹ️',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      await loadProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));
  };

  const ensureCanUpload = (): boolean => {
    if (!user || !session) {
      toast.error('You must be signed in to upload images. Please sign in again.');
      return false;
    }
    if (!isAdmin) {
      toast.error('Admin access required to upload images.');
      return false;
    }
    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ensureCanUpload()) {
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      e.target.value = '';
      return;
    }

    setImageUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm((f) => ({ ...f, image_url: url }));
      toast.success('Image uploaded — click Save Product to publish on the website');
    } catch (error) {
      const message = formatStorageUploadError(error);
      toast.error(message);
      if (message.toLowerCase().includes('bucket') || message.toLowerCase().includes('policy')) {
        toast(STORAGE_MIGRATION_HINT, { duration: 8000, icon: 'ℹ️' });
      }
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (!ensureCanUpload()) {
      e.target.value = '';
      return;
    }

    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select image files');
      e.target.value = '';
      return;
    }

    setGalleryUploading(true);
    try {
      const urls = await Promise.all(imageFiles.map((file) => uploadProductImage(file)));
      setForm((f) => ({ ...f, gallery_urls: [...f.gallery_urls, ...urls] }));
      toast.success(
        imageFiles.length === 1 ? 'Image added to gallery' : `${imageFiles.length} images added`
      );
    } catch (error) {
      const message = formatStorageUploadError(error);
      toast.error(message);
      if (message.toLowerCase().includes('bucket') || message.toLowerCase().includes('policy')) {
        toast(STORAGE_MIGRATION_HINT, { duration: 8000, icon: 'ℹ️' });
      }
    } finally {
      setGalleryUploading(false);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    setForm((f) => ({
      ...f,
      gallery_urls: f.gallery_urls.filter((_, i) => i !== index),
    }));
  };

  const triggerVariantImageUpload = (index: number) => {
    variantUploadIndexRef.current = index;
    variantFileInputRef.current?.click();
  };

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = variantUploadIndexRef.current;
    if (!file) return;

    if (!ensureCanUpload()) {
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      e.target.value = '';
      return;
    }

    setVariantImageUploading(index);
    try {
      const url = await uploadProductImage(file);
      updateVariant(index, 'image_url', url);
      toast.success('Variant image uploaded — click Save Product to publish on the website');
    } catch (error) {
      const message = formatStorageUploadError(error);
      toast.error(message);
      if (message.toLowerCase().includes('bucket') || message.toLowerCase().includes('policy')) {
        toast(STORAGE_MIGRATION_HINT, { duration: 8000, icon: 'ℹ️' });
      }
    } finally {
      setVariantImageUploading(null);
      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark-brown">Products</h1>
          <p className="text-medium-brown mt-1">Manage your ghee product catalog</p>
        </div>
        <Button variant="gold" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {loading ? (
        <p className="text-medium-brown">Loading products...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-medium-brown border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Variants</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Featured</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const totalStock = product.product_variants.reduce((s, v) => s + v.stock, 0);
                const minPrice = Math.min(
                  ...product.product_variants.map((v) =>
                    getDisplayPrice(v.price, product.apply_gst ?? false, product.gst_rate ?? 5)
                  )
                );
                return (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-cream p-1 shrink-0">
                          <ProductImage
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-dark-brown">{product.name}</p>
                          <p className="text-sm text-gold">From {formatPrice(minPrice)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-medium-brown">{product.category}</td>
                    <td className="px-6 py-4 text-medium-brown">
                      {product.product_variants.map((v) => formatBottleLabel(1, v.size)).join(' · ')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          totalStock < 10 ? 'text-red-500' : 'text-dark-brown'
                        }`}
                      >
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured && <Star className="w-5 h-5 text-gold fill-gold" />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center py-12 text-medium-brown">No products yet. Add your first product.</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-dark-brown">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        name: e.target.value,
                        slug: f.slug || slugify(e.target.value),
                      }))
                    }
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-brown mb-1">Short Description</label>
                <input
                  value={form.short_description}
                  onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
                  className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-brown mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-brown mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-brown mb-1">Product Image</label>
                {form.image_url && (
                  <div className="mb-3 w-32 h-32 rounded-lg bg-cream p-2 border border-medium-brown/30">
                    <ProductImage
                      src={form.image_url}
                      alt="Product preview"
                      className="w-full h-full"
                    />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isLoading={imageUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {imageUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                <input
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                  placeholder="Or paste image URL (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-brown mb-1">
                  Additional Images
                </label>
                <p className="text-xs text-medium-brown mb-2">
                  Extra photos shown in the product gallery on the website
                </p>
                {form.gallery_urls.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3">
                    {form.gallery_urls.map((url, index) => (
                      <div key={`${url}-${index}`} className="relative group bg-cream p-1.5 rounded-lg border border-medium-brown/30">
                        <ProductImage
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full aspect-square"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-90 hover:opacity-100 shadow-sm"
                          aria-label="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isLoading={galleryUploading}
                  onClick={() => galleryInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {galleryUploading ? 'Uploading...' : 'Add Gallery Images'}
                </Button>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="rounded border-medium-brown/30"
                  />
                  <span className="text-sm font-medium text-dark-brown">Featured (Bestseller badge)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.apply_gst}
                    onChange={(e) => setForm((f) => ({ ...f, apply_gst: e.target.checked }))}
                    className="rounded border-medium-brown/30"
                  />
                  <span className="text-sm font-medium text-dark-brown">
                    Apply GST (price shown includes GST)
                  </span>
                </label>
                {form.apply_gst && (
                  <div>
                    <label className="block text-sm font-medium text-dark-brown mb-1">GST Rate (%)</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.gst_rate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, gst_rate: Number(e.target.value) || 0 }))
                      }
                      className="w-full max-w-xs p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-brown mb-2">Benefits</label>
                {form.benefits.map((b, i) => (
                  <input
                    key={i}
                    value={b}
                    onChange={(e) => {
                      const benefits = [...form.benefits];
                      benefits[i] = e.target.value;
                      setForm((f) => ({ ...f, benefits }));
                    }}
                    className="w-full p-2 mb-2 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder={`Benefit ${i + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, benefits: [...f.benefits, ''] }))}
                  className="text-sm text-gold hover:underline"
                >
                  + Add benefit
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-brown mb-2">Size Variants</label>
                <p className="text-xs text-medium-brown mb-3">
                  Add sizes smallest to largest (e.g. 500ml, 1L). Upload a jar photo per size so the
                  product page switches images when customers pick a size. Leave variant image empty to
                  use the main product image.
                </p>
                <input
                  ref={variantFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleVariantImageUpload}
                  className="hidden"
                />
                {form.variants.map((variant, i) => (
                  <div key={i} className="border border-medium-brown/20 rounded-lg p-3 mb-3 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        placeholder="Size (e.g. 500ml)"
                        value={variant.size}
                        onChange={(e) => updateVariant(i, 'size', e.target.value)}
                        className="p-2 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price || ''}
                        onChange={(e) => updateVariant(i, 'price', Number(e.target.value))}
                        className="p-2 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock || ''}
                        onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))}
                        className="p-2 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      {variant.image_url && (
                        <div className="w-16 h-16 rounded-lg bg-cream p-1 border border-medium-brown/30 flex-shrink-0">
                          <ProductImage
                            src={variant.image_url}
                            alt={`${variant.size || 'Variant'} jar`}
                            className="w-full h-full"
                          />
                        </div>
                      )}
                      <input
                        placeholder="Variant image URL (optional — e.g. 500ml jar photo)"
                        value={variant.image_url || ''}
                        onChange={(e) => updateVariant(i, 'image_url', e.target.value)}
                        className="flex-1 p-2 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold text-sm"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        isLoading={variantImageUploading === i}
                        onClick={() => triggerVariantImageUpload(i)}
                        className="whitespace-nowrap"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {variantImageUploading === i ? 'Uploading...' : 'Upload Jar Photo'}
                      </Button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      variants: [...f.variants, { size: '', price: 0, stock: 0, image_url: '' }],
                    }))
                  }
                  className="text-sm text-gold hover:underline"
                >
                  + Add variant
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="gold" onClick={handleSave} isLoading={saving} className="flex-1">
                  {editingId ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

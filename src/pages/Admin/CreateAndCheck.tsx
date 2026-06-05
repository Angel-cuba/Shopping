import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  fetchProducts,
  addProductToStock,
  updateProductInStock,
  deleteProductFromStock,
} from '../../redux/actions/ProductActions';
import {
  NewProductToStock,
  Product,
  Sizes,
  Variants,
  VariantsColors,
} from '../../interfaces/products/ProductType';
import { toastSuccess, toastError, toastDelete } from '../../utils/toasts';

const CATEGORIES = ['Summer', 'Winter', 'Spring', 'Autumn'];

const BLANK: NewProductToStock = {
  name: '',
  description: '',
  image: '',
  categories: '',
  inStock: 0,
  sizes: [],
  variants: [],
  price: 0,
};

const CreateAndCheck: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((s: RootState) => s.products);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewProductToStock>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  /* ── form helpers ── */
  const resetForm = () => { setForm(BLANK); setEditingId(null); setShowForm(false); };

  const openCreate = () => { setForm(BLANK); setEditingId(null); setShowForm(true); };

  const openEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      image: p.image,
      categories: p.categories as string,
      inStock: p.inStock,
      sizes: p.sizes as string[],
      variants: p.variants as string[],
      price: p.price,
    });
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const set = (key: keyof NewProductToStock) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const toggleSize = (s: string) =>
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s],
    }));

  const toggleVariant = (v: string) =>
    setForm(f => ({
      ...f,
      variants: f.variants.includes(v) ? f.variants.filter(x => x !== v) : [...f.variants, v],
    }));

  const allSizes    = () => setForm(f => ({ ...f, sizes: [...Sizes] }));
  const clearSizes  = () => setForm(f => ({ ...f, sizes: [] }));
  const allVariants   = () => setForm(f => ({ ...f, variants: [...Variants] }));
  const clearVariants = () => setForm(f => ({ ...f, variants: [] }));

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.image || !form.categories ||
        form.price < 1 || form.inStock < 1 || !form.sizes.length || !form.variants.length) {
      toastError('Please fill all fields');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await dispatch(updateProductInStock({ ...form, id: editingId }));
        toastSuccess('Product updated');
      } else {
        const { id: _id, ...payload } = form;
        await dispatch(addProductToStock(payload));
        toastSuccess('Product added');
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  /* ── delete ── */
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await dispatch(deleteProductFromStock(id));
      toastDelete('Product deleted');
    } finally {
      setDeletingId(null);
    }
  };

  /* ── styles ── */
  const ROW_2COL: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-4)',
    marginBottom: 'var(--space-4)',
  };

  const toggleBtn = (active: boolean): React.CSSProperties => ({
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    cursor: 'pointer',
    border: active ? '1.5px solid var(--color-action)' : '1.5px solid var(--color-border)',
    background: active ? 'var(--color-action-subtle)' : 'transparent',
    color: active ? 'var(--color-action)' : 'var(--color-fg-secondary)',
    transition: 'all .15s',
  });

  const variantBtn = (v: string, active: boolean): React.CSSProperties => ({
    padding: '4px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    cursor: 'pointer',
    border: active ? `1.5px solid ${VariantsColors[v]}` : '1.5px solid var(--color-border)',
    background: active ? `${VariantsColors[v]}22` : 'transparent',
    color: active ? VariantsColors[v] : 'var(--color-fg-secondary)',
    transition: 'all .15s',
  });

  return (
    <>
      {/* ── Header ── */}
      <div className="stride-section-head" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <span className="stride-eyebrow">Admin</span>
          <h2>Products</h2>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
            {products.length} product{products.length !== 1 ? 's' : ''}
          </span>
          {showForm ? (
            <button className="stride-btn stride-btn--ghost" onClick={resetForm}>
              Cancel
            </button>
          ) : (
            <button className="stride-btn" onClick={openCreate}>
              <i className="fa fa-plus" style={{ marginRight: 6 }} />
              Add product
            </button>
          )}
        </div>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="stride-card stride-card__pad" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
            {editingId ? 'Edit product' : 'New product'}
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Row 1: name + category */}
            <div style={ROW_2COL}>
              <div className="stride-field" style={{ margin: 0 }}>
                <label className="stride-label">Name</label>
                <input
                  className="stride-input"
                  placeholder="e.g. Air Max 90"
                  value={form.name}
                  onChange={set('name')}
                />
              </div>
              <div className="stride-field" style={{ margin: 0 }}>
                <label className="stride-label">Category</label>
                <select className="stride-input" value={form.categories} onChange={set('categories')}>
                  <option value="">Select category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: price + inStock */}
            <div style={ROW_2COL}>
              <div className="stride-field" style={{ margin: 0 }}>
                <label className="stride-label">Price ($)</label>
                <input
                  className="stride-input"
                  type="number"
                  min={1}
                  placeholder="0"
                  value={form.price || ''}
                  onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                />
              </div>
              <div className="stride-field" style={{ margin: 0 }}>
                <label className="stride-label">In stock</label>
                <input
                  className="stride-input"
                  type="number"
                  min={1}
                  placeholder="0"
                  value={form.inStock || ''}
                  onChange={e => setForm(f => ({ ...f, inStock: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* Row 3: image URL */}
            <div className="stride-field" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="stride-label">Image URL</label>
              <input
                className="stride-input"
                placeholder="https://…"
                value={form.image}
                onChange={set('image')}
              />
            </div>

            {/* Row 4: description */}
            <div className="stride-field" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="stride-label">Description</label>
              <textarea
                className="stride-input"
                placeholder="Describe the product…"
                rows={3}
                style={{ resize: 'vertical' }}
                value={form.description}
                onChange={set('description')}
              />
            </div>

            {/* Variants */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <label className="stride-label" style={{ margin: 0 }}>Variants</label>
                <button type="button" className="stride-btn stride-btn--ghost" style={{ fontSize: 'var(--text-xs)', padding: '2px 10px' }} onClick={allVariants}>All</button>
                <button type="button" className="stride-btn stride-btn--ghost" style={{ fontSize: 'var(--text-xs)', padding: '2px 10px' }} onClick={clearVariants}>Clear</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Variants.map(v => (
                  <button key={v} type="button" style={variantBtn(v, form.variants.includes(v))} onClick={() => toggleVariant(v)}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <label className="stride-label" style={{ margin: 0 }}>Sizes</label>
                <button type="button" className="stride-btn stride-btn--ghost" style={{ fontSize: 'var(--text-xs)', padding: '2px 10px' }} onClick={allSizes}>All</button>
                <button type="button" className="stride-btn stride-btn--ghost" style={{ fontSize: 'var(--text-xs)', padding: '2px 10px' }} onClick={clearSizes}>Clear</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Sizes.map(s => (
                  <button key={s} type="button" style={toggleBtn(form.sizes.includes(s))} onClick={() => toggleSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button type="submit" className="stride-btn" disabled={saving}>
                {saving
                  ? (editingId ? 'Saving…' : 'Adding…')
                  : (editingId ? 'Save changes' : 'Add product')}
              </button>
              <button type="button" className="stride-btn stride-btn--ghost" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Product table ── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="stride-sk" style={{ height: 52, borderRadius: 'var(--radius-sm)' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="stride-empty">
          <i className="fa fa-tag" />
          <h3>No products yet</h3>
          <p>Click "Add product" to create your first listing.</p>
        </div>
      ) : (
        <div className="stride-card">
          <table className="stride-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sizes</th>
                <th>Variants</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: Product) => (
                <tr key={p.id} style={editingId === p.id ? { background: 'var(--color-action-subtle)' } : undefined}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span style={{ fontWeight: 600, color: 'var(--color-fg-primary)' }}>{p.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="stride-badge stride-badge--soft">{p.categories as string}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                  <td>
                    <span style={{ color: p.inStock < 5 ? 'var(--color-sale)' : 'inherit' }}>
                      {p.inStock}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
                    {(p.sizes as string[]).join(', ')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(p.variants as string[]).map(v => (
                        <span
                          key={v}
                          title={v}
                          style={{
                            display: 'inline-block',
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: VariantsColors[v] ?? '#ccc',
                            border: '1px solid var(--color-border)',
                          }}
                        />
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        className="stride-btn stride-btn--ghost"
                        style={{ padding: '4px 10px', fontSize: 'var(--text-xs)' }}
                        onClick={() => openEdit(p)}
                      >
                        <i className="fa fa-pencil" />
                      </button>
                      <button
                        className="stride-btn stride-btn--ghost"
                        style={{ padding: '4px 10px', fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p.id)}
                      >
                        {deletingId === p.id
                          ? <i className="fa fa-spinner fa-spin" />
                          : <i className="fa fa-trash" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default CreateAndCheck;

import React, { FormEvent, useEffect } from 'react';
import { UserPayment } from '../../interfaces/user/UserType';
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { addingPayment, updatingPayment } from '../../redux/actions/PaymentAction';
import { toastError, toastSuccess } from '../../utils/toasts';

type ProfilePaymentProps = {
  userId: string | undefined;
  setOpenPaymentToEdit: (editPayment: boolean) => void;
  selectedPayment: UserPayment | undefined;
  setSelectedPayment: (payment: UserPayment | undefined) => void;
};

const initialUserPayment: UserPayment = {
  paymentType: '',
  provider: '',
  cardNumber: '',
  expirationDate: '',
  cardHolderName: '',
};

const PAYMENT_TYPES = ['Credit', 'Debit', 'Prepaid'];
const PROVIDERS     = ['Visa', 'Mastercard', 'Amex', 'Discover', 'Other'];

const ProfilePayment = ({
  userId,
  setOpenPaymentToEdit,
  selectedPayment,
  setSelectedPayment,
}: ProfilePaymentProps) => {
  const [form, setForm] = React.useState<UserPayment>(
    selectedPayment?.id ? selectedPayment : initialUserPayment
  );

  useEffect(() => {
    if (selectedPayment) setForm(selectedPayment);
  }, [selectedPayment]);

  const dispatch = useDispatch<AppDispatch>();

  const isEditing = Boolean(form.id);

  const handleField = (field: keyof UserPayment, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const cancel = () => {
    setOpenPaymentToEdit(false);
    setForm(initialUserPayment);
    setSelectedPayment(undefined);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { paymentType, provider, cardNumber, expirationDate, cardHolderName } = form;
    if (!paymentType || !provider || !cardNumber || !expirationDate || !cardHolderName) {
      return toastError("All fields are required");
    }

    if (isEditing) {
      dispatch(updatingPayment({ ...form, user: { id: userId } }));
      toastSuccess('Payment method updated');
      setSelectedPayment(undefined);
    } else {
      dispatch(addingPayment({ paymentType, provider, cardNumber, expirationDate, cardHolderName, user: { id: userId } }));
      toastSuccess('Payment method added');
    }
    setOpenPaymentToEdit(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-fg-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 'var(--space-1)' }}>
        {isEditing ? 'Edit card' : 'New payment method'}
      </p>

      {/* Card holder */}
      <div className="stride-field">
        <label htmlFor="py-holder">Cardholder name</label>
        <input
          id="py-holder"
          className="stride-input"
          type="text"
          value={form.cardHolderName}
          onChange={(e) => handleField('cardHolderName', e.target.value)}
          placeholder="Full name on card"
          autoComplete="cc-name"
        />
      </div>

      {/* Card number */}
      <div className="stride-field">
        <label htmlFor="py-number">Card number</label>
        <input
          id="py-number"
          className="stride-input"
          type="text"
          value={form.cardNumber}
          onChange={(e) => handleField('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
          placeholder="•••• •••• •••• ••••"
          autoComplete="cc-number"
          maxLength={16}
        />
      </div>

      {/* Type + Provider side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div className="stride-field">
          <label htmlFor="py-type">Type</label>
          <select
            id="py-type"
            className="stride-input"
            value={form.paymentType}
            onChange={(e) => handleField('paymentType', e.target.value)}
          >
            <option value="" disabled>Select type</option>
            {PAYMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="stride-field">
          <label htmlFor="py-provider">Provider</label>
          <select
            id="py-provider"
            className="stride-input"
            value={form.provider}
            onChange={(e) => handleField('provider', e.target.value)}
          >
            <option value="" disabled>Select provider</option>
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expiration date */}
      <div className="stride-field" style={{ maxWidth: 200 }}>
        <label htmlFor="py-exp">Expiration date</label>
        <input
          id="py-exp"
          className="stride-input"
          type="text"
          value={form.expirationDate}
          onChange={(e) => handleField('expirationDate', e.target.value)}
          placeholder="MM/YY"
          pattern="\d{2}/\d{2}"
          maxLength={5}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <button
          className="stride-btn stride-btn--primary"
          type="submit"
        >
          {isEditing ? 'Update card' : 'Add card'}
        </button>
        <button
          className="stride-btn stride-btn--ghost"
          type="button"
          onClick={cancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfilePayment;

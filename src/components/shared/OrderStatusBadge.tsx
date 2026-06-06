import React from 'react';
import { OrderStatus } from '../../interfaces/profile/order/orderType';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:    'Pending',
  CONFIRMED:  'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED:    'Shipped',
  DELIVERED:  'Delivered',
  CANCELLED:  'Cancelled',
};

export const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING:    'stride-badge--soft',
  CONFIRMED:  'stride-badge--soft',
  PROCESSING: 'stride-badge--soft',
  SHIPPED:    'stride-badge',
  DELIVERED:  'stride-badge--green',
  CANCELLED:  'stride-badge--sale',
};

export const OrderStatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const s     = (status ?? 'PENDING') as OrderStatus;
  const label = STATUS_LABEL[s] ?? s;
  const cls   = STATUS_CLASS[s] ?? 'stride-badge--soft';
  return <span className={`stride-badge ${cls}`}>{label}</span>;
};

export const formatOrderDate = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

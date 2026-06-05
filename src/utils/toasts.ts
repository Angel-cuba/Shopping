/**
 * Typed toast helpers.
 *
 * Replaces the ad-hoc inline helpers spread across ProductById, Login,
 * and Profile. The legacy handleToast() in notifications.ts is a
 * stringly-typed dispatch table; this module is the typed alternative
 * that all new code should use.
 */
import { toast } from 'react-hot-toast';

const DARK_SUCCESS = { background: '#111', color: '#fff', fontWeight: '600' } as const;

export const toastSuccess = (msg: string) =>
  toast.success(msg, { position: 'top-center', duration: 2000, style: DARK_SUCCESS });

export const toastError = (msg: string) =>
  toast.error(msg, { position: 'top-center', duration: 2500 });

export const toastDelete = (msg: string) =>
  toast(msg, { icon: '🗑', position: 'top-center', duration: 1800 });

export const toastInfo = (msg: string) =>
  toast(msg, { position: 'top-center', duration: 2000 });

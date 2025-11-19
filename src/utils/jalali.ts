import type { ConfigType } from 'dayjs';
import dayjsLib from 'dayjs';
import jalaliday from 'jalaliday';

const isoDayRegex = /^\d{4}-\d{2}-\d{2}/;
const isoMonthRegex = /^\d{4}-\d{2}$/;
const isoYearRegex = /^\d{4}$/;

dayjsLib.extend(jalaliday);

type MaybeString = string | number | Date | undefined | null;

const ensureDayjs = (value: MaybeString): ReturnType<typeof dayjsLib> | null => {
  if (value == null) return null;
  if (typeof value === 'string') {
    if (isoDayRegex.test(value)) {
      return dayjsLib(value);
    }
    if (isoMonthRegex.test(value)) {
      return dayjsLib(`${value}-01`);
    }
    if (isoYearRegex.test(value)) {
      return dayjsLib(`${value}-01-01`);
    }
  }
  const date = dayjsLib(value as ConfigType);
  return date.isValid() ? date : null;
};

const formatWithFallback = (value: MaybeString, format = 'YYYY/MM/DD'): string => {
  const parsed = ensureDayjs(value);
  if (!parsed) {
    return value != null ? String(value) : '';
  }
  return parsed.calendar('jalali').locale('fa').format(format);
};

export const dayjs = dayjsLib;

export const formatToJalali = (value: MaybeString, format = 'YYYY/MM/DD') => formatWithFallback(value, format);

export const formatToJalaliDateTime = (value: MaybeString) => formatWithFallback(value, 'YYYY/MM/DD HH:mm');

export const formatToJalaliMonth = (value: MaybeString) => formatWithFallback(value, 'MMMM YYYY');

export const formatToJalaliAxis = (value: MaybeString): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('fa-IR');
  }
  if (typeof value === 'string') {
    const parsed = ensureDayjs(value);
    if (!parsed) return value;
    const format = isoDayRegex.test(value)
      ? 'YYYY/MM/DD'
      : isoMonthRegex.test(value)
        ? 'YYYY/MM'
        : isoYearRegex.test(value)
          ? 'YYYY'
          : 'YYYY/MM/DD';
    return parsed.calendar('jalali').locale('fa').format(format);
  }
  return formatWithFallback(value, 'YYYY/MM/DD');
};

export const toIsoDateString = (value: MaybeString): string => {
  const parsed = ensureDayjs(value);
  if (!parsed) return '';
  return parsed.format('YYYY-MM-DD');
};

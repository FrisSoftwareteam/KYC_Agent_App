import {TOnsiteField, TOnsiteSection} from '@/apis/onsite-form';

// What is still needed, worked out on the phone the same way as the server, so the
// agent sees the count change as they type. The server checks again on submit.
const present = (field: TOnsiteField, v: any) => {
  if (v === undefined || v === null || v === '') {
    return false;
  }
  if (field.type === 'files' || field.type === 'group') {
    return Array.isArray(v) && v.length >= Math.max(1, field.min || 1);
  }
  if (field.digits) {
    return String(v).replace(/\D/g, '').length === field.digits;
  }
  return true;
};

export const missingIn = (fields: TOnsiteField[], values: any, prefix = ''): string[] => {
  const out: string[] = [];
  fields.forEach(field => {
    const v = values?.[field.key];
    if (field.required && !present(field, v)) {
      out.push(`${prefix}${field.label}`);
    } else if (field.type === 'files' && field.min && Array.isArray(v) && v.length && v.length < field.min) {
      out.push(`${prefix}${field.label} (at least ${field.min})`);
    }
    if (field.type === 'group' && Array.isArray(v)) {
      v.forEach((entry, i) =>
        out.push(...missingIn(field.fields || [], entry, `${prefix}${field.label} ${i + 1}: `)),
      );
    }
  });
  return out;
};

export const missingInForm = (form: TOnsiteSection[] = [], answers: any) => {
  const all = form.flatMap(s => missingIn(s.fields, answers));
  if (answers?.hasLoans === true && !answers?.loans?.length) {
    all.push('Existing loans: add each loan');
  }
  return all;
};

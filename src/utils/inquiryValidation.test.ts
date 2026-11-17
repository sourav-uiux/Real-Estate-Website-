import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterGalleryByCategory,
  isInquiryValid,
  validateInquiryForm,
} from './inquiryValidation';

test('validateInquiryForm rejects empty required fields without bypassing validation', () => {
  const errors = validateInquiryForm(
    {
      fullName: ' ',
      email: '',
      phone: '',
      preferredDate: '',
      message: '',
    },
    '2026-11-16',
  );

  assert.equal(isInquiryValid(errors), false);
  assert.ok(errors.fullName);
  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.ok(errors.preferredDate);
  assert.equal(errors.message, undefined);
});

test('validateInquiryForm rejects invalid email, short phone, and past date', () => {
  const errors = validateInquiryForm(
    {
      fullName: 'Claire Moreau',
      email: 'claire@invalid',
      phone: '123',
      preferredDate: '2026-11-10',
      message: 'Short',
    },
    '2026-11-16',
  );

  assert.equal(isInquiryValid(errors), false);
  assert.equal(errors.fullName, undefined);
  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.ok(errors.preferredDate);
  assert.ok(errors.message);
});

test('validateInquiryForm accepts complete valid inquiry data', () => {
  const errors = validateInquiryForm(
    {
      fullName: 'Henri Delacroix',
      email: 'henri.delacroix@atelier.fr',
      phone: '+33 6 12 34 56 78',
      preferredDate: '2026-11-24',
      message: 'Requesting a late afternoon private tour.',
    },
    '2026-11-16',
  );

  assert.equal(isInquiryValid(errors), true);
});

test('filterGalleryByCategory returns all or matching items', () => {
  const items = [
    { id: '1', category: 'Architecture' },
    { id: '2', category: 'Interiors' },
    { id: '3', category: 'Details' },
  ];

  assert.equal(filterGalleryByCategory(items, 'All').length, 3);
  assert.deepEqual(
    filterGalleryByCategory(items, 'Interiors').map((i) => i.id),
    ['2'],
  );
});

export const FOOD_CATEGORIES = [
  { value: 'cooked-food', label: 'Cooked Food' },
  { value: 'raw-vegetables', label: 'Raw Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'bakery', label: 'Bakery & Bread' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'packaged', label: 'Packaged Food' },
  { value: 'other', label: 'Other' },
];

export const QUANTITY_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'litres', label: 'Litres' },
  { value: 'portions', label: 'Portions' },
  { value: 'packets', label: 'Packets' },
  { value: 'items', label: 'Items' },
];

export const USER_ROLES = {
  ADMIN: 'admin',
  DONOR: 'donor',
  NGO: 'ngo',
  VOLUNTEER: 'volunteer',
};

export const DONATION_STATUS_COLORS = {
  available: 'bg-green-100 text-green-800',
  requested: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  reserved: 'bg-purple-100 text-purple-800',
  assigned: 'bg-indigo-100 text-indigo-800',
  collected: 'bg-teal-100 text-teal-800',
  delivered: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-gray-100 text-gray-800',
  expired: 'bg-red-100 text-red-800',
  cancelled: 'bg-orange-100 text-orange-800',
};

export const REQUEST_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  collected: 'bg-blue-100 text-blue-800',
  delivered: 'bg-teal-100 text-teal-800',
  completed: 'bg-purple-100 text-purple-800',
};


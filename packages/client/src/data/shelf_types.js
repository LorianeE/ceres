import { createEnum } from '../utils/EnumUtils';

export const SHELF_TYPES_ARRAY = [
  'cold',
  'drinks',
  'produce',
  'hygiene',
  'home',
  'grocery'
]

export const SHELF_TYPES = createEnum({
  cold: 'Rayon frais',
  drinks: 'Boissons',
  produce: 'Fruits & Légumes',
  hygiene: 'Hygiène',
  home: 'Maison',
  grocery: 'Épicerie',
});

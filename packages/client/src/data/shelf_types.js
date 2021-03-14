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

export const PRODUCT_PLACES_ARRAY = [
  'Frigo',
  'Placards',
  'Salle de bain',
]

export const PRODUCT_PLACES = createEnum({
  cold: 'Frigo',
  drinks: 'Placards',
  produce: 'Placards',
  hygiene: 'Salle de bain',
  home: 'Placards',
  grocery: 'Placards',
});

/** Carte de démonstration : prix indicatifs, à remplacer par la carte réelle. */

export type DishTag = 'veg' | 'spicy' | 'new' | 'signature';

export interface Dish {
  name: string;
  description: string;
  price: number;
  tags?: DishTag[];
}

export interface MenuCategory {
  id: string;
  label: string;
  intro: string;
  image: { src: string; alt: string };
  dishes: Dish[];
}

export const tagLabels: Record<DishTag, string> = {
  veg: 'Végétarienne',
  spicy: 'Piquante',
  new: 'Nouveauté',
  signature: 'Signature',
};

/** Filtres proposés au-dessus de la carte. */
export const menuFilters: DishTag[] = ['veg', 'spicy', 'new'];

export const charcoalSupplement = 1;

export const menu: MenuCategory[] = [
  {
    id: 'classiques',
    label: 'Les classiques',
    intro: 'Les recettes que l’on ne change pas, sur une pâte fine maturée 48 h.',
    image: { src: '/media/margherita.webp', alt: 'Une margherita sortie du four, mozzarella fondue et basilic' },
    dishes: [
      { name: 'Margherita', description: 'Sauce tomate, mozzarella, basilic frais, huile d’olive', price: 8.5, tags: ['veg'] },
      { name: 'Regina', description: 'Sauce tomate, mozzarella, jambon blanc, champignons', price: 10 },
      { name: 'Napolitaine', description: 'Sauce tomate, mozzarella, anchois, câpres, olives noires', price: 9.9 },
      { name: 'Quatre fromages', description: 'Mozzarella, gorgonzola, chèvre, parmesan', price: 10.9, tags: ['veg'] },
      { name: 'Calzone', description: 'Pizza pliée : tomate, mozzarella, jambon, œuf, champignons', price: 10.9 },
      { name: 'Diavola', description: 'Sauce tomate, mozzarella, salame piquant, piment d’Espelette', price: 10.5, tags: ['spicy'] },
      { name: 'Végétarienne', description: 'Sauce tomate, mozzarella, poivrons, oignons rouges, olives, champignons', price: 10.2, tags: ['veg'] },
      { name: 'Reine des bois', description: 'Sauce tomate, mozzarella, champignons de Paris et pleurotes, persillade', price: 10.7, tags: ['veg'] },
      { name: 'Pepperoni', description: 'Sauce tomate, mozzarella, pepperoni, origan', price: 10.4, tags: ['spicy'] },
      { name: 'Romaine', description: 'Sauce tomate, mozzarella, anchois, origan, ail', price: 9.6 },
      { name: 'Orientale', description: 'Sauce tomate, mozzarella, merguez, poivrons, oignons, œuf', price: 11.2, tags: ['spicy'] },
    ],
  },
  {
    id: 'creations',
    label: 'Les créations',
    intro: 'Les idées de la maison, souvent nées d’un produit du marché.',
    image: { src: '/media/margherita-burrata.webp', alt: 'Pizza garnie de burrata et de basilic, croûte bien dorée' },
    dishes: [
      { name: 'La Ponte', description: 'Sauce tomate, mozzarella, jambon cru, roquette, copeaux de parmesan', price: 11.9, tags: ['signature'] },
      { name: 'Mélusine', description: 'Chèvre, miel, une pointe de paprika', price: 11.5, tags: ['veg'] },
      { name: 'La Bretonne', description: 'Crème, andouille, pommes poêlées, emmental', price: 11.5 },
      { name: 'La Potagère', description: 'Sauce tomate, mozzarella, légumes grillés, pesto', price: 10.5, tags: ['veg'] },
      { name: 'La Piccante', description: 'Sauce tomate, mozzarella, chorizo, poivrons, huile pimentée', price: 10.9, tags: ['spicy'] },
      { name: 'Burrata d’automne', description: 'Tomates confites, burrata entière posée à la sortie du four, basilic', price: 13.5, tags: ['veg', 'new'] },
      { name: 'La Vilaine', description: 'Pâte au charbon, crème de cèpes, magret fumé, noisettes torréfiées', price: 13.9, tags: ['new', 'signature'] },
      { name: 'Nduja e miele', description: 'Sauce tomate, mozzarella, nduja de Calabre, miel de châtaignier', price: 12.4, tags: ['spicy', 'new'] },
      { name: 'Mortadella', description: 'Base blanche, mortadelle à la pistache, burrata, zestes de citron', price: 13.2, tags: ['new'] },
      { name: 'La Cessonnaise', description: 'Sauce tomate, mozzarella, saucisse de Molène, oignons confits, sarrasin grillé', price: 12.6, tags: ['signature'] },
      { name: 'Figue et gorgonzola', description: 'Crème, gorgonzola, figues rôties, noix, filet de miel', price: 12.1, tags: ['veg'] },
    ],
  },
  {
    id: 'blanches',
    label: 'Bases crème',
    intro: 'Sans tomate, sur une crème fraîche légère.',
    image: { src: '/media/pizza-table.webp', alt: 'Pizza servie sur une table sombre, croûte gonflée' },
    dishes: [
      { name: 'Savoyarde', description: 'Crème, mozzarella, pommes de terre, lardons, reblochon', price: 12.2 },
      { name: 'Saumon', description: 'Crème citronnée, mozzarella, saumon fumé, aneth, câpres', price: 12.9 },
      { name: 'Chèvre épinards', description: 'Crème, mozzarella, pousses d’épinard, chèvre frais, noix', price: 11.4, tags: ['veg'] },
      { name: 'Carbonara', description: 'Crème, mozzarella, lardons, oignons, jaune d’œuf, poivre noir', price: 11.2 },
      { name: 'Truffe', description: 'Crème à la truffe, mozzarella, champignons, parmesan', price: 14.5, tags: ['veg', 'new'] },
      { name: 'Poulet curry', description: 'Crème au curry doux, mozzarella, poulet, oignons rouges, coriandre', price: 11.8 },
      { name: 'Montagnarde', description: 'Crème, mozzarella, raclette, jambon cru, pommes de terre', price: 12.8 },
      { name: 'Saint-Jacques', description: 'Crème au cidre, mozzarella, noix de Saint-Jacques, poireaux fondants', price: 15.9, tags: ['new'] },
    ],
  },
  {
    id: 'douceurs',
    label: 'Desserts et boissons',
    intro: 'Pour finir, ou pour accompagner.',
    image: { src: '/media/salle.webp', alt: 'La salle du restaurant, éclairée par des guirlandes' },
    dishes: [
      { name: 'Tiramisu maison', description: 'Mascarpone, café serré, cacao amer', price: 6.5 },
      { name: 'Panna cotta', description: 'Coulis de fruits rouges du moment', price: 5.9 },
      { name: 'Pizza Nutella', description: 'Pâte fine, pâte à tartiner, noisettes, à partager', price: 7.9, tags: ['new'] },
      { name: 'Affogato', description: 'Glace vanille, espresso versé à table', price: 5.5 },
      { name: 'Café gourmand', description: 'Espresso, mini tiramisu, panna cotta et un cannolo', price: 7.5 },
      { name: 'Cannoli siciliens', description: 'Deux cannoli à la ricotta, pistache et écorces d’orange', price: 6.2, tags: ['new'] },
      { name: 'Sorbet citron et limoncello', description: 'Deux boules de sorbet, un trait de limoncello', price: 6.8 },
      { name: 'Verre de vin rouge', description: 'Montepulciano d’Abruzzo, ou conseil du patron', price: 4.8 },
      { name: 'Bière artisanale', description: 'Brasserie bretonne, 33 cl', price: 5.2 },
      { name: 'Limonade', description: 'Limonade artisanale citron ou framboise', price: 3.6 },
      { name: 'Spritz', description: 'Apérol, prosecco, eau pétillante, tranche d’orange', price: 7.5 },
      { name: 'Verre de prosecco', description: 'Prosecco DOC, 12 cl', price: 5.5 },
      { name: 'Chinotto', description: 'Soda italien aux agrumes amers, 27,5 cl', price: 3.9 },
      { name: 'Eau pétillante', description: 'San Pellegrino, 50 cl', price: 3.2 },
      { name: 'Espresso', description: 'Café italien serré, torréfié à Rennes', price: 1.9 },
    ],
  },
];

export const formatPrice = (n: number): string =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

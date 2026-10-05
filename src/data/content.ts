/** Contenus éditoriaux de démonstration : plat du jour, savoir-faire, galerie, avis. */

export const dailySpecial = {
  price: 8.9,
  formula: { price: 12.9, label: 'Formule plat + dessert' },
  /** Clé : jour de la semaine (0 = dimanche). */
  week: {
    2: { dish: 'Lasagnes maison', side: 'salade verte' },
    3: { dish: 'Risotto aux champignons', side: 'copeaux de parmesan' },
    4: { dish: 'Escalope milanaise', side: 'pâtes au pesto' },
    5: { dish: 'Pavé de saumon', side: 'tagliatelles au citron' },
  } as Record<number, { dish: string; side: string }>,
};

export interface StoryStep {
  title: string;
  text: string;
  figure: string;
  media: { type: 'video' | 'image'; src: string; poster?: string; alt: string };
}

export const story: StoryStep[] = [
  {
    title: 'Pétrir',
    text: 'Farine italienne, eau, sel, très peu de levure. La pâte repose ensuite deux jours au frais.',
    figure: '48 h de repos',
    media: { type: 'video', src: '/media/farine.mp4', poster: '/media/farine.webp', alt: 'De la farine tombe sur un pâton' },
  },
  {
    title: 'Façonner',
    text: 'Chaque pâton est étalé à la main, jamais au rouleau, pour garder l’air dans la croûte.',
    figure: 'À la main',
    media: { type: 'video', src: '/media/geste.mp4', poster: '/media/geste.webp', alt: 'Le pizzaiolo fait tourner la pâte' },
  },
  {
    title: 'Garnir',
    text: 'Une sauce tomate simple, cuisinée le matin même, puis la garniture choisie.',
    figure: 'Sauce du jour',
    media: { type: 'video', src: '/media/sauce-loop.mp4', poster: '/media/sauce-loop.webp', alt: 'La sauce tomate est étalée à la louche' },
  },
  {
    title: 'Cuire',
    text: 'Quelques minutes dans un four très chaud : la croûte gonfle et se tache de brun.',
    figure: 'Four très chaud',
    media: { type: 'image', src: '/media/four-flammes.webp', alt: 'Une pizza cuit devant les flammes du four' },
  },
  {
    title: 'Servir',
    text: 'Elle part en salle tout de suite, ou dans sa boîte si vous l’emportez.',
    figure: 'Sur place ou à emporter',
    media: { type: 'video', src: '/media/service.mp4', poster: '/media/service.webp', alt: 'Une margherita posée sur la table' },
  },
];

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  /**
   * Taille de la tuile. La grille (4 colonnes) se remplit dans l'ordre :
   * le total doit faire un multiple de 4 cases (big = 4, tall = 2, wide = 2, square = 1)
   * pour une grille sans trou. Ici : 4 + 2 + 1 + 1 + 2 + 1 + 1 + 2 + 1 + 1 = 16 cases.
   */
  size: 'big' | 'tall' | 'wide' | 'square';
}

export const gallery: GalleryItem[] = [
  { src: '/media/salle.webp', alt: 'La salle, éclairée par des guirlandes lumineuses', caption: 'La salle', size: 'big' },
  { src: '/media/hero.webp', alt: 'Une pizza sort du four sur la pelle', caption: 'Tout juste sortie du four', size: 'tall' },
  { src: '/media/parts-noires.webp', alt: 'Parts de pizza au basilic sur fond noir', caption: 'À partager', size: 'square' },
  { src: '/media/petrir.webp', alt: 'Des mains pétrissent la pâte sur le plan de travail fariné', caption: 'La pâte, faite maison', size: 'square' },
  { src: '/media/equipe.webp', alt: 'Le pizzaiolo sourit en sortant une pizza du four', caption: 'L’équipe', size: 'wide' },
  { src: '/media/pizzaiolo-four.webp', alt: 'Le pizzaiolo enfourne une pizza', caption: 'Au four', size: 'square' },
  { src: '/media/devanture.webp', alt: 'Devanture d’une pizzeria éclairée le soir', caption: 'Le soir, en terrasse', size: 'square' },
  { src: '/media/four-flammes.webp', alt: 'Les flammes du four à bois, en gros plan', caption: 'Le feu du four', size: 'wide' },
  { src: '/media/margherita-burrata.webp', alt: 'Une pizza à la burrata et au basilic', caption: 'Burrata d’automne', size: 'square' },
  { src: '/media/pepperoni.webp', alt: 'Une pizza pepperoni bien gratinée', caption: 'Pepperoni', size: 'square' },
];

export interface Review {
  author: string;
  when: string;
  rating: number;
  text: string;
  dough?: 'classique' | 'charbon';
}

export const reviews: Review[] = [
  { author: 'Camille Rouxel', when: 'il y a 2 semaines', rating: 5, text: 'Des pizzas excellentes, et on peut choisir la pâte au charbon. On y revient.', dough: 'charbon' },
  { author: 'Yann Le Goff', when: 'il y a 1 mois', rating: 5, text: 'Une vraie ambiance familiale, on s’y sent bien. Le patron prend le temps de répondre à nos questions.' },
  { author: 'Maëlle Guillou', when: 'il y a 3 semaines', rating: 4, text: 'Service rapide, et la commande par téléphone est très pratique pour emporter.' },
  { author: 'Thomas Bréhaut', when: 'il y a 5 jours', rating: 5, text: 'La Vilaine sur pâte noire : magret, cèpes, noisettes. Surprenant et vraiment bon.', dough: 'charbon' },
  { author: 'Sophie Danet', when: 'il y a 2 mois', rating: 5, text: 'Le plat du jour à 8,90 € le midi, copieux et fait maison. Parfait pour une pause déjeuner.' },
  { author: 'Erwan Morvan', when: 'il y a 1 semaine', rating: 4, text: 'Pâte fine et croustillante comme on l’aime. Petite salle, pensez à réserver le vendredi.' },
  { author: 'Inès Belkacem', when: 'il y a 3 mois', rating: 5, text: 'Les enfants ont adoré la pizza Nutella. Accueil adorable avec les petits.' },
  { author: 'Pierre-Yves Lamour', when: 'il y a 4 semaines', rating: 5, text: 'Meilleure pizzeria du coin. Le tiramisu maison vaut à lui seul le détour.' },
  { author: 'Nolwenn Cadiou', when: 'il y a 6 jours', rating: 5, text: 'La Burrata d’automne est une merveille. La burrata arrive entière, encore froide sur la pâte chaude.' },
  { author: 'Karim Haddad', when: 'il y a 2 semaines', rating: 4, text: 'Très bonnes pizzas. Un peu d’attente le vendredi soir, mais on nous a prévenus au téléphone.' },
  { author: 'Gwenaëlle Le Bihan', when: 'il y a 1 mois', rating: 5, text: 'Commandé deux pizzas noires pour emporter : bien chaudes à l’arrivée, croûte toujours croustillante.', dough: 'charbon' },
  { author: 'Julien Perrot', when: 'il y a 2 mois', rating: 3, text: 'Bonnes pizzas mais salle bruyante le vendredi soir. Je reviendrai plutôt un midi.' },
  { author: 'Aurélie Tanguy', when: 'il y a 3 semaines', rating: 5, text: 'Anniversaire de ma fille : ils ont mis une bougie sur la pizza Nutella. Adorables.' },
  { author: 'Marco Bellini', when: 'il y a 5 semaines', rating: 5, text: 'En tant qu’Italien, je valide la Margherita. Pâte légère, bonne mozzarella, rien à redire.' },
];

export const ingredients = [
  'Pâte maturée 48 h',
  'Farine italienne type 00',
  'Mozzarella fior di latte',
  'Tomates pelées d’Italie',
  'Basilic frais',
  'Charbon végétal actif',
  'Huile d’olive des Pouilles',
  'Burrata des Pouilles',
  'Jambon de Parme 18 mois',
  'Parmigiano Reggiano 24 mois',
  'Légumes du marché de Cesson',
];

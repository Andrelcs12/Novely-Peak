export interface GenreCard {
  id: string;
  label: string;
  icon: string;
  gradient: string;
  uri: string;
}

export const GENRE_CARDS: GenreCard[] = [
  {
    id: "foco",
    label: "Foco",
    icon: "Target",
    gradient: "from-blue-600 to-cyan-400",
    uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M", // Deep Focus
  },
  {
    id: "estudo",
    label: "Estudo",
    icon: "BookOpen",
    gradient: "from-emerald-600 to-teal-400",
    uri: "spotify:playlist:37i9dQZF1DX8Uebhn9wzrS", // Lo-Fi Beats
  },
  {
    id: "funk",
    label: "Funk",
    icon: "Flame",
    gradient: "from-orange-500 to-red-500",
    uri: "spotify:playlist:37i9dQZF1DX0FOF1IUWK1W", // Funk Hits BR
  },
  {
    id: "gringa",
    label: "Gringa",
    icon: "Globe",
    gradient: "from-indigo-500 to-purple-500",
    uri: "spotify:playlist:37i9dQZF1DXcZDD7cfEKhW", // Today's Top Hits
  },
  {
    id: "pagode",
    label: "Pagode",
    icon: "Music2",
    gradient: "from-amber-500 to-yellow-400",
    uri: "spotify:playlist:37i9dQZF1DX6th9L0vstz2", // Pagodeira
  },
  {
    id: "sertanejo",
    icon: "Mic2",
    label: "Sertanejo",
    gradient: "from-rose-500 to-pink-500",
    uri: "spotify:playlist:37i9dQZF1DX3rxVfibe1L0", // Sertanejo Hits
  },
];
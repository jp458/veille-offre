export type Feed = {
  name: string;
  url: string;
};

export type Category = {
  id: string;
  label: string;
  description: string;
  feeds: Feed[];
};

export const categories: Category[] = [
  {
    id: "securite",
    label: "Sécurité & attaques",
    description: "CERT-FR, CISA, alertes vulnérabilités, actu menaces",
    feeds: [
      { name: "CERT-FR — Avis", url: "https://www.cert.ssi.gouv.fr/avis/feed/" },
      { name: "CERT-FR — Alertes", url: "https://www.cert.ssi.gouv.fr/alerte/feed/" },
      { name: "ANSSI — Actualités", url: "https://www.ssi.gouv.fr/feed/" },
      { name: "CISA — Cybersecurity Advisories", url: "https://www.cisa.gov/cybersecurity-advisories/all.xml" },
      { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
      { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/" },
      { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/" },
    ],
  },
  {
    id: "it",
    label: "IT généraliste",
    description: "Actu tech, dev, cloud — pouls général du secteur",
    feeds: [
      { name: "Hacker News (front page)", url: "https://hnrss.org/frontpage" },
      { name: "LinuxFr", url: "https://linuxfr.org/news.atom" },
      { name: "Korben", url: "https://korben.info/feed" },
      { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index" },
      { name: "The Register", url: "https://www.theregister.com/headlines.atom" },
    ],
  },
  {
    id: "appareils",
    label: "Appareils & hardware",
    description: "iPhone, Samsung, Xiaomi, PC — sorties et tests",
    feeds: [
      { name: "GSMArena", url: "https://www.gsmarena.com/rss-news-reviews.php3" },
      { name: "9to5Mac", url: "https://9to5mac.com/feed/" },
      { name: "MacRumors", url: "https://feeds.macrumors.com/MacRumors-All" },
      { name: "Android Authority", url: "https://www.androidauthority.com/feed/" },
      { name: "XDA Developers", url: "https://www.xda-developers.com/feed/" },
      { name: "Tom's Hardware", url: "https://www.tomshardware.com/feeds/all" },
    ],
  },
];


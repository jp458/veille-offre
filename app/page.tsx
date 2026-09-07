import { getAllItems } from "../lib/rss";
import FeedDashboard from "../components/FeedDashboard";

// Revalide les flux toutes les heures (évite de refaire 20 requêtes RSS à chaque visite)
export const revalidate = 3600;

export default async function Home() {
  const { items, categories } = await getAllItems();

  return (
    <main className="container">
      <header>
        <h1>Veille informatique</h1>
        <p className="subtitle">
          Sécurité, IT généraliste et appareils — mis à jour toutes les heures
        </p>
      </header>
      <FeedDashboard items={items} categories={categories} />
    </main>
  );
}


import { getJobMatches } from "../../lib/job-search";
import JobList from "../../components/JobList";

// Recherche + scoring IA relancés au maximum toutes les 12h (pour limiter les coûts d'API)
export const revalidate = 43200;

export default async function EmploiPage() {
  const jobs = await getJobMatches();

  return (
    <main className="container">
      <header>
        <h1>Veille emploi</h1>
        <p className="subtitle">
          Offres en Côte d'Ivoire, tous secteurs, scorées par correspondance avec le profil
          ({jobs.length} offre{jobs.length > 1 ? "s" : ""} ≥75% trouvée{jobs.length > 1 ? "s" : ""})
        </p>
      </header>
      <JobList jobs={jobs} />
    </main>
  );
}


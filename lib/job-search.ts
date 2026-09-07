import { candidateProfile } from "./candidate-profile";

export type JobMatch = {
  title: string;
  company: string;
  sector: string;
  location: string;
  match_score: number;
  justification: string;
  url: string;
  source: string;
  date_posted: string;
};

const SEARCH_SITES = [
  "educarriere.ci",
  "novojob.com",
  "emploi.ci",
  "rmo-jobcenter.com",
  "cybersecuritymag.africa",
  "linkedin.com/jobs",
];

const PROMPT = `Tu es un assistant de recherche d'emploi. Voici le profil d'un candidat :

${candidateProfile}

Recherche sur le web des offres d'emploi ACTUELLEMENT OUVERTES en Côte d'Ivoire (tous secteurs d'activité confondus — banque, télécom, industrie, administration publique, ONG, conseil, etc.), en priorité sur ces sites : ${SEARCH_SITES.join(", ")}, mais aussi tout autre site d'emploi ivoirien pertinent que tu trouves.

Pour chaque offre trouvée, évalue un pourcentage de correspondance avec le profil du candidat (match_score, de 0 à 100), en te basant sur l'intitulé du poste, les compétences demandées et le niveau d'expérience requis. Ne retiens QUE les offres avec un match_score de 75 ou plus.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après, sans balises markdown, au format suivant :

[
  {
    "title": "intitulé du poste",
    "company": "nom de l'entreprise (si connu, sinon 'Non précisé')",
    "sector": "secteur d'activité",
    "location": "ville",
    "match_score": 85,
    "justification": "une phrase courte expliquant le score",
    "url": "lien direct vers l'offre",
    "source": "nom du site source",
    "date_posted": "date approximative de publication ou 'Récent'"
  }
]

Si aucune offre pertinente n'est trouvée, réponds avec un tableau vide [].`;

const MODEL = "gemini-2.5-flash";

export async function getJobMatches(): Promise<JobMatch[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY manquante dans les variables d'environnement Vercel.");
    return [];
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: PROMPT }] }],
          tools: [{ google_search: {} }],
        }),
      }
    );

    if (!response.ok) {
      console.error("Erreur API Gemini:", response.status, await response.text());
      return [];
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts
      .map((p: any) => p.text || "")
      .filter(Boolean)
      .join("\n");

    const clean = text.replace(/```json|```/g, "").trim();
    const jsonStart = clean.indexOf("[");
    const jsonEnd = clean.lastIndexOf("]");
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Réponse inattendue (pas de JSON trouvé):", text.slice(0, 500));
      return [];
    }

    const parsed = JSON.parse(clean.slice(jsonStart, jsonEnd + 1));
    return (parsed as JobMatch[])
      .filter((j) => j.match_score >= 75)
      .sort((a, b) => b.match_score - a.match_score);
  } catch (err) {
    console.error("Erreur lors de la recherche d'emploi:", (err as Error).message);
    return [];
  }
}


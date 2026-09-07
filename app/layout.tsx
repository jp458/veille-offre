import "./globals.css";

export const metadata = {
  title: "Veille informatique",
  description: "Tableau de bord de veille locale — sécurité, IT, appareils",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <nav className="topnav">
          <a href="/">Veille informatique</a>
          <a href="/emploi">Veille emploi</a>
        </nav>
        {children}
      </body>
    </html>
  );
}


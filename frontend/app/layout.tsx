import "./globals.css";
import Navbar from "../compnents/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <Navbar />

        <main className="max-w-7xl mx-auto">
          {children}
        </main>

      </body>
    </html>
  );
}
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick'n'Full Demostración",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const baseStyle: React.CSSProperties = {  fontSize: '16px', boxSizing: 'border-box', display: 'block', position: 'static', margin: '0', padding: '0',
    WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", backgroundColor: 'white', scrollBehavior: 'smooth' }

  return (
    <html lang="es" style={baseStyle}>
      <body style={baseStyle}>
        {children}
      </body>
    </html>
  );
}

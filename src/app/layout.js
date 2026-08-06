import { Providers } from "./providers/providers";
import "./globals.css";
import { ToastContainer } from "react-toastify";


export const metadata = {
  title: "Book Lover || Home",
  description: "A book lover's paradise, where stories come alive and imagination knows no bounds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}

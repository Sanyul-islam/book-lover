import { Providers } from "./providers/providers";
import "./globals.css";
import NavbarComponent from "@/components/UI/Navbar/Navbar";
import Footer from "@/components/UI/Footer/Footer";
import { ToastContainer } from "react-toastify";


export const metadata = {
  title: "Book Lover",
  description: "A book lover's paradise, where stories come alive and imagination knows no bounds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
          <NavbarComponent />
          {children}
          <Footer />
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}

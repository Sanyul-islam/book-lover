import Footer from "@/components/UI/Footer/Footer";
import NavbarComponent from "@/components/UI/Navbar/Navbar";


const layout = ({ children }) => {
    return (
      <main>
        <NavbarComponent />
        {children}
        <Footer />
      </main>
    );
};

export default layout;
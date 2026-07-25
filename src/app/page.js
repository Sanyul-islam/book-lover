import Carousel from "@/component/UI/Banner/Slider";
import TopLibrarians from "@/component/UI/Body/TopLibrarians";
import Footer from "@/component/UI/Footer/Footer";
import NavbarComponent from "@/component/UI/Navbar/Navbar";


export default function Home() {
  return (
    <>
    <NavbarComponent/>
    <Carousel/>
    <TopLibrarians/>
    <Footer/>
    </>
  );
}

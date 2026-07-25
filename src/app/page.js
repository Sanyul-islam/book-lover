import Carousel from "@/component/UI/Banner/Slider";
import PopularCategories from "@/component/UI/Body/PopularCategories";
import TopLibrarians from "@/component/UI/Body/TopLibrarians";
import Footer from "@/component/UI/Footer/Footer";
import NavbarComponent from "@/component/UI/Navbar/Navbar";


export default function Home() {
  return (
    <>
    <NavbarComponent/>
    <Carousel/>
    <PopularCategories/>
    <TopLibrarians/>
    <Footer/>
    </>
  );
}

import Carousel from "@/component/UI/Banner/Slider";
import FeaturedBooks from "@/component/UI/Body/FeaturedBooks";
import PopularCategories from "@/component/UI/Body/PopularCategories";
import TopLibrarians from "@/component/UI/Body/TopLibrarians";
import WhyChooseUs from "@/component/UI/Body/WhyChooseUs";
import Footer from "@/component/UI/Footer/Footer";
import NavbarComponent from "@/component/UI/Navbar/Navbar";


export default function Home() {
  return (
    <>
    <NavbarComponent/>
    <Carousel/>
    <FeaturedBooks/>
    <PopularCategories/>
    <TopLibrarians/>
    <WhyChooseUs/>
    <Footer/>
    </>
  );
}

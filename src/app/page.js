import Carousel from "@/components/UI/Banner/Slider";
import FeaturedBooks from "@/components/UI/Body/FeaturedBooks";
import PopularCategories from "@/components/UI/Body/PopularCategories";
import ReadingBenefits from "@/components/UI/Body/ReadingBenefits";
import Reviews from "@/components/UI/Body/Reviews";
import TopLibrarians from "@/components/UI/Body/TopLibrarians";
import WhyChooseUs from "@/components/UI/Body/WhyChooseUs";
import Footer from "@/components/UI/Footer/Footer";
import NavbarComponent from "@/components/UI/Navbar/Navbar";


export default function Home() {
  return (
    <>
    
    <Carousel/>
    <FeaturedBooks/>
    <PopularCategories/>
    <TopLibrarians/>
    <ReadingBenefits/>
    <WhyChooseUs/>
    <Reviews/>
    
    </>
  );
}

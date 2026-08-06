import Footer from '@/components/UI/Footer/Footer';
import NavbarComponent from '@/components/UI/Navbar/Navbar';
import React from 'react';

const Mainlayout = ({ children }) => {
    return (
        <main>
         <NavbarComponent />
         {children}
         <Footer />    
        </main>
    );
};

export default Mainlayout;
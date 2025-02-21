import React from "react";
import ScrollUp from "../components/Common/ScrollUp";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Video from "../components/Video";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import RollingGallery from '../components/MultiCarousel/RollingGallery'

export default function Home() {
    return (
        <>
            <ScrollUp />
            <Hero />
            <Features />
            <Video />
            <RollingGallery autoplay={true} pauseOnHover={true} />
            <Testimonials />
            <Contact />
        </>
    );
}

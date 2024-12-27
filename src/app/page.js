import React from "react";
import { Link } from "react-router-dom"; // Importa solo Link
import ScrollUp from "../components/Common/ScrollUp";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Video from "../components/Video";
import AboutSection from "../components/About/AboutSection";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";

export const metadata = {
    title: "Free Next.js Template for Startup and SaaS",
    description: "This is Home for Startup Nextjs Template",
};

export default function Home() {
    return (
        <>
            <ScrollUp />
            <Hero />
            <Features />
            <Video />
            <AboutSection />
            <Testimonials />
            <Pricing />
            <Contact />
            <nav>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/features">Features</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/testimonials">Testimonials</Link>
                <Link to="/video">Video</Link>
            </nav>
        </>
    );
}
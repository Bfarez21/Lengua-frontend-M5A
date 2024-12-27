import React from "react";
import ScrollUp from "../components/Common/ScrollUp";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Video from "../components/Video";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Header from "../components/Header";

export default function Home() {
    return (
        <>
            <ScrollUp />
            <Header />
            <Hero />
            <Features />
            <Video />
            <Testimonials />
            <Contact />
        </>
    );
}

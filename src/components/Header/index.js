import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Asegúrate de que estás importando Link
import { menuData } from "./menuData"; // Asegúrate de importar correctamente el archivo de menú

const Header = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [sticky, setSticky] = useState(false);
    const [openIndex, setOpenIndex] = useState(-1);

    // Maneja la activación del menú hamburguesa
    const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

    // Cambia la clase sticky al hacer scroll
    const handleStickyNavbar = () => {
        setSticky(window.scrollY >= 80);
    };

    // Maneja el menú desplegable
    const handleSubmenu = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    // Añadir el evento de scroll
    useEffect(() => {
        window.addEventListener("scroll", handleStickyNavbar);
        return () => window.removeEventListener("scroll", handleStickyNavbar);
    }, []);

    return (
        <header
            className={`header left-0 top-0 z-40 w-full items-center ${
                sticky
                    ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed bg-white shadow-sticky backdrop-blur-sm transition-all"
                    : "absolute bg-transparent"
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="relative flex items-center justify-between py-4">
                    <div className="w-60 max-w-full">
                        <Link
                            to="/"
                            className={`header-logo block w-full ${sticky ? "py-2" : "py-8"}`}
                        >
                            <img
                                src="/images/logo/logo-2.svg"
                                alt="logo"
                                width={140}
                                height={30}
                                className="w-full dark:hidden"
                            />
                            <img
                                src="/images/logo/logo.svg"
                                alt="logo"
                                width={140}
                                height={30}
                                className="hidden w-full dark:block"
                            />
                        </Link>
                    </div>
                    <div className="flex items-center justify-between w-full px-4">
                        <button
                            onClick={navbarToggleHandler}
                            className="lg:hidden block absolute right-4 top-1/2 transform -translate-y-1/2"
                            aria-label="Toggle Navigation"
                        >
                            <span
                                className={`block w-8 h-0.5 bg-black transition-all duration-300 ${
                                    navbarOpen ? "rotate-45" : ""
                                }`}
                            ></span>
                            <span
                                className={`block w-8 h-0.5 bg-black transition-all duration-300 ${
                                    navbarOpen ? "opacity-0" : ""
                                }`}
                            ></span>
                            <span
                                className={`block w-8 h-0.5 bg-black transition-all duration-300 ${
                                    navbarOpen ? "-rotate-45" : ""
                                }`}
                            ></span>
                        </button>

                        {/* Menú de navegación */}
                        <nav
                            className={`absolute right-0 top-full w-[250px] bg-white px-6 py-4 lg:static lg:w-auto lg:bg-transparent ${
                                navbarOpen ? "block" : "hidden"
                            }`}
                        >
                            <ul className="lg:flex lg:space-x-12 lg:items-center">
                                {menuData.map((item, index) => (
                                    <li key={item.id}>
                                        {/* Si tiene submenu, manejarlo */}
                                        {item.submenu ? (
                                            <>
                                                <p
                                                    onClick={() => handleSubmenu(index)}
                                                    className="py-2 text-dark hover:text-primary cursor-pointer"
                                                >
                                                    {item.title}
                                                </p>
                                                {openIndex === index && (
                                                    <ul className="pl-4">
                                                        {item.submenu.map((subItem) => (
                                                            <li key={subItem.id}>
                                                                <Link
                                                                    to={subItem.path}
                                                                    className="block py-1 text-dark hover:text-primary"
                                                                >
                                                                    {subItem.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                to={item.path || "#"}
                                                className="py-2 text-dark hover:text-primary"
                                            >
                                                {item.title}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

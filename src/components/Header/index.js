import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuData } from "./menuData";
import ThemeToggler from "./ThemeToggler";
import { AuthContext } from "../../firebase/AuthContext"; // Asegúrate de que este contexto esté disponible
import { logout } from "../../firebase/authService";

const Header = () => {
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const location = useLocation();

  return (
    <header
      className={`header left-0 top-0 z-40 flex w-full items-center ${
        sticky
          ? "dark:bg-gray-900 dark:shadow-md fixed z-[9999] bg-white !bg-opacity-80 shadow-md backdrop-blur-sm transition"
          : "absolute bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="relative -mx-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="block py-5">
              <img
                src="/images/logo/img-logo01.png"
                alt="logo"
                className="h-16 dark:hidden"
              />
              <img
                src="/images/logo/img-logo01.png"
                alt="logo"
                className="hidden h-10 dark:block"
              />
            </Link>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              >
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "top-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "top-[-8px] -rotate-45" : ""
                  }`}
                />
              </button>
              <nav
                id="navbarCollapse"
                className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-gray-200 bg-white px-6 py-4 duration-300 dark:border-gray-700 dark:bg-gray-900 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                  navbarOpen
                    ? "visibility top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                }`}
              >
                {/* Menu Items */}
                <ul className="block lg:flex lg:space-x-12">
                  {menuData.map((menuItem, index) => (
                    <li key={index} className="group relative">
                      {menuItem.path ? (
                        <Link
                          to={menuItem.path}
                          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            location.pathname === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      ) : (
                        <p
                          onClick={() => handleSubmenu(index)}
                          className="flex cursor-pointer items-center justify-between py-2 text-base text-gray-900 group-hover:text-blue-600 dark:text-gray-200 dark:hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                        >
                          {menuItem.title}
                          <span className="pl-3">
                            <svg width="25" height="24" viewBox="0 0 25 24">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Mostrar elementos de autenticación o datos del usuario */}
            <div className="flex items-center justify-end pr-16 lg:pr-0">
              {user ? (
                <>
                  <Link to="/perfil" className="flex items-center">
                    <img
                      src={user.photoURL} // Imagen del usuario
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="ml-2">{user.displayName}</span>
                  </Link>

                  <button
                    onClick={logout}
                    className="ml-4 px-4 py-2 text-base font-medium text-gray-900 hover:opacity-70 dark:text-white"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  className="hidden px-7 py-3 text-base font-medium text-gray-900 hover:opacity-70 dark:text-white md:block rounded-2xl bg-blue-600"
                >
                  Iniciar sesión
                </Link>
              )}
              <div>
                <ThemeToggler />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

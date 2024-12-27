import React, { useState, useEffect } from "react";

const ThemeToggler = () => {
    const [theme, setTheme] = useState("light");

    // Apply the theme class to the root element
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove(theme === "light" ? "dark" : "light");
        root.classList.add(theme);
    }, [theme]);

    // Toggle theme function
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    return (
        <button
            aria-label="theme toggler"
            onClick={toggleTheme}
            className="flex items-center justify-center text-black rounded-full cursor-pointer bg-gray-200 dark:bg-gray-800 h-9 w-9 dark:text-white md:h-14 md:w-14"
        >
            {/* SVG for Light Mode */}
            {theme === "light" ? (
                <svg
                    viewBox="0 0 25 24"
                    fill="none"
                    className="w-5 h-5 md:h-6 md:w-6"
                >
                    <path
                        d="M9.55078 1.5C5.80078 1.5 1.30078 5.25 1.30078 11.25C1.30078 17.25 5.80078 21.75 11.8008 21.75C17.8008 21.75 21.5508 17.25 21.5508 13.5C13.3008 18.75 4.30078 9.75 9.55078 1.5Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                // SVG for Dark Mode
                <svg
                    viewBox="0 0 25 24"
                    fill="none"
                    className="w-5 h-5 md:h-6 md:w-6"
                >
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggler;

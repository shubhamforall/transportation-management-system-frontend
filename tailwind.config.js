/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: "#2d324a",
        secondary: "#10b981",
        accent: "#f59e0b",
        muted: "#6b7280",

        // UI text colors
        NavigationMenu: "#D1D5DB",
        activeNavigationMenu: "#22b378",
        NavigationMenuHover: "#1f293d", 
        iconColour: "#1f293d", 
        muted: "#9ca3af", 
        subtle: "#f3f4f6", 

        // Status colors
        headerText: "#515c8f",
        error: "#ef4444", 
        warning: "#f97316", 
        info: "#3b82f6", 

        // Table colors
        tableHeader: "#6c718a",
      },
    },
  },
  plugins: [],
};

import type { Metadata } from "next";
import { Roboto } from "next/font/google"; // Import Roboto font
import "../app/styles/globals.css";
import { UserProvider } from "../../src/app/context/UserContext";
import { SettingsProvider } from "../../src/app/context/RolesContext"; 
import { MenuProvider } from "./context/MenuContext";
import { ThemeProvider } from "./context/ThemeContext";

// Load Roboto font
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // Define font weights
  variable: "--font-roboto", // Custom CSS variable
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans`}> {/* Apply font */}
        <MenuProvider>
          <UserProvider>
            <ThemeProvider>

            <SettingsProvider>
              {children}
            </SettingsProvider>
            </ThemeProvider>
          </UserProvider>
        </MenuProvider>
      </body>
    </html>
  );
}



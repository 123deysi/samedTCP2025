import { FaBars, FaTimes } from "react-icons/fa";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoSunny } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { navItems } from "./NavItems";
import "../Styles/main.css";
import { useToggleContext, useThemeContext } from "../Components/ThemeProvider";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = useThemeContext();
  const cambiarTema = useToggleContext();
  return (
    <header>
      <nav>
      <div className="flex items-center gap-4 mx-4 my-1">
  {/* Primer contenedor: UMSS 
  <div className="bg-white rounded-md custom:bg-transparent custom:flex custom:p-1 flex items-center gap-4">
    <img
      src="/umss.png"
      alt="Logo UMSS"
      className="first-logo rounded-md"
    />
  </div>*/}

  {/* Segundo contenedor: SAMED */}
  <div className="rounded-md p-1 flex items-center">
    <img
      src="/logo.png"
      alt="Logo SAMED"
      className="samed-logo"
    />
   <h1 className="text-white text-3xl font-extrabold tracking-wider uppercase drop-shadow-md">
    SAMED TCP
  </h1>

  </div>
</div>

        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars
            id="bars"
            key="first"
            className={menuOpen ? "open" : ""}
          ></FaBars>
          <FaTimes
            id="close"
            key="second"
            className={menuOpen ? "open" : ""}
          ></FaTimes>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          {navItems.map((item, index) => {
            const isFirstItem = index === 0;
            return (
              <li key={item.id || index}>
                <NavLink
                  to={item.path}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={isFirstItem ? "flex text-center items-center" : ""}
                >
                  {isFirstItem && item.icon && <>{item.icon}&nbsp;</>}
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div
          id="settings"
          className="p-2 hover:bg-white hover:text-black rounded-lg m-2"
        >
          
        </div>
      </nav>
    </header>
  );
}
export default Navbar;

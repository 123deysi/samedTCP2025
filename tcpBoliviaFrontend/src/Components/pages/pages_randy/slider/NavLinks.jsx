import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useState } from "react";
const NavLinks = () => {

  const [dropdown, setDropdown] = useState(false);
  return (
    <div className="fa">
      <div id="test-prueba" className="text-center flex items-center rounded-lg p-3 custom:mx-3 hover:bg-white hover:text-black cursor-pointer" onClick={() => setDropdown(!dropdown)}>
        Observatorio&nbsp;
        <IoMdArrowDropdown />
      </div>
      <div className="bg-white"><ul id="observatorio-menu" className={"rounded-lg border-solid border-2 border-black custom:rounded-none custom:border-0 custom:text-center" + (dropdown ? " open" : "")}
>
        <li className="submenu p-1">
          <NavLink to="./Cronologias" onClick={() => setDropdown(!dropdown)}>Cronologias</NavLink>
        </li>
       
        <li className="submenu p-1">
          <NavLink to="./Dinamicas" onClick={() => setDropdown(!dropdown)}>Dinamicas</NavLink>
        </li>
        <li className="submenu p-1">
          <NavLink to="./Jurisprudencia" onClick={() => setDropdown(!dropdown)}>Jurisprudencia</NavLink>
        </li>
      </ul></div>
    </div>
  );
};

export default NavLinks;

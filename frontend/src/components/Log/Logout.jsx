//Imports
import React from "react";

//Deconnexion
const Logout = () => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <li onClick={logout}>
      <img src="../images/logout.svg" alt="logout" />
    </li>
  );
};

export default Logout;

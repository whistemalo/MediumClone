import Image from "next/image";
import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      {/* #mitad izquierda logo y links */}
      <div className=" flex items-center space-x-5">
        {/* logo */}
        <Link href="/">
          <img
            className="w-44 object-contain cursor-pointer"
            src="https://links.papareact.com/yvf"
            alt="medium_logo"
          />
        </Link>
        <div className="hidden md:inline-flex  space-x-5">
          <h3>About</h3>
          <h3>Conact</h3>
          <h3 className="text-white bg-green-600 px-4 py-1 rounded-full">
            Follow
          </h3>
        </div>
      </div>

      {/* #mitad derecha inicio de sesion  */}
      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sing In</h3>
        <h3 className="border px-4 py-1 rounded-full border-green-600">
          Get Started
        </h3>
      </div>
    </header>
  );
}

export default Navbar;

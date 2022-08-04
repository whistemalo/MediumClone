import React from "react";

function Hero() {
  return (
    <div className="flex justify-between items-center
     bg-yellow-400 border-y border-black py-10 lg:py-0">
      {/* Texto en el lado izquierdo */}
      <div className=" px-10 space-y-5">
        <h1 className="text-6xl max-w-xl font-serif">
          <span className="underline decoration-black decoration-4">Medium</span> is a place to Write, Read and Connect
        </h1>
        <h2>
          Its easy and free to post your thinking on any topic and connect with
          millions of readers
        </h2>
      </div>
      {/* Icono con la letra M en el lado derecho  */}
      <img className="hidden md:inline-flex h-32 lg:h-full" src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt="Medium Logo" />
    </div>
  );
}

export default Hero;

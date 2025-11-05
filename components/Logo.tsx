import Image from "next/image";
import React from "react";
import { pageRoutes } from "../utils/pageRoutes";

export default function Logo() {
  return (
    <a href={pageRoutes.home} className="cursor-pointer">
      <Image
        className="justify-center items-center"
        src="/images/logoorange.png"
        alt="blocStage"
        width={150}
        height={40}
      />
    </a>
  );
}

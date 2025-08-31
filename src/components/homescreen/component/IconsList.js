"use client";

import React from "react";
import styles from "../../animation.module.css";
import CoFrame from "../../UI/Icons/coframe";
import SalesF from "../../UI/Icons/salesF";
import Discord from "../../UI/Icons/discord";
import StatFlo from "../../UI/Icons/statflo";
import DayB from "../../UI/Icons/dayBreak";
import MCK from "../../UI/Icons/mcK";
import Five from "../../UI/Icons/five";
import Reforge from "../../UI/Icons/reforge";
import Jusb from "../../UI/Icons/jusb";
import Car from "../../UI/Icons/car";
import Doo from "../../UI/Icons/doo";
import Hub from "../../UI/Icons/hub";
import Serif from "../../UI/Icons/serif";
import Crush from "../../UI/Icons/crush";
import Jerich from "../../UI/Icons/jerich";
import Symbolic from "../../UI/Icons/symbolic";

export default function IconsList() {
  const Icons1 = [
    {
      name: Doo,
    },
    {
      name: CoFrame,
    },
    {
      name: SalesF,
    },
    {
      name: Discord,
    },
    {
      name: StatFlo,
    },
    {
      name: DayB,
    },
    {
      name: MCK,
    },
    {
      name: Five,
    },
    {
      name: Reforge,
    },
    {
      name: Jusb,
    },
    {
      name: Car,
    },
    {
      name: Hub,
    },
    {
      name: Serif,
    },
    {
      name: Crush,
    },
    {
      name: Jerich,
    },
    {
      name: Symbolic,
    },
  ];

  return (
    <div className={styles.scroller} data-direction="left" data-speed="fast">
      <ul className={`${styles.scrollerInner} ${styles.tagList}`}>
        {Icons1.map((icon, index) => {
          const IconsComponent = icon.name;
          return (
            <li
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <IconsComponent />
            </li>
          );
        })}
      </ul>
    </div>
  );
}




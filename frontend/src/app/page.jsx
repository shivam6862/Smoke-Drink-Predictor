"use client";
import { useState } from "react";
import styles from "@/styles/page.module.css";
import Formfill from "@/components/Formfill";
import SmokerDrinker from "@/components/SmokerDrinker";
import { MdOpenInNew } from "react-icons/md";

export default function Home() {
  const [smokerDrinkerResult, setSmokerDrinkerResult] = useState([
    {
      models: {
        smoking: {
          result: "__",
          probability: "__",
        },
        drinking: {
          result: "__",
          probability: "__",
        },
      },
    },
  ]);
  const [showSmokerDrinker, setShowSmokerDrinker] = useState(false);

  return (
    <div className={styles.container}>
      <div
        className={styles.togglebutton}
        onClick={() => {
          setShowSmokerDrinker(true);
        }}
      >
        <MdOpenInNew />
      </div>
      <Formfill
        setSmokerDrinkerResult={setSmokerDrinkerResult}
        setShowSmokerDrinker={setShowSmokerDrinker}
      />
      {showSmokerDrinker && (
        <div
          className={styles.backdrop}
          onClick={() => {
            setShowSmokerDrinker(false);
          }}
        ></div>
      )}
      {showSmokerDrinker && (
        <SmokerDrinker smokerDrinkerResult={smokerDrinkerResult} />
      )}
    </div>
  );
}

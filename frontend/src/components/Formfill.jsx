"use client";
import { useState } from "react";
import classes from "@/styles/Formfill.module.css";
import usePYModels from "@/hook/usePYModels";
import userData from "@/components/data.json";
import { useNotification } from "@/hook/useNotification";

const Formfill = ({ setSmokerDrinkerResult, setShowSmokerDrinker }) => {
  const [smokerDrinkerUserData, setSmokerDrinkerUserData] = useState({
    sex: "",
    age: "",
    height: "",
    weight: "",
    waistline: "",
    sight_left: "",
    sight_right: "",
    SBP: "",
    DBP: "",
    BLDS: "",
    tot_chole: "",
    HDL_chole: "",
    LDL_chole: "",
    triglyceride: "",
    hemoglobin: "",
    serum_creatinine: "",
    SGOT_AST: "",
    SGOT_ALT: "",
    gamma_GTP: "",
  });
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(
    Array(19).fill(false)
  );
  const { predictSmokerDrinker } = usePYModels();
  const { NotificationHandler } = useNotification();

  const onSubmit = async () => {
    if (
      !smokerDrinkerUserData.sex ||
      !smokerDrinkerUserData.age ||
      !smokerDrinkerUserData.height ||
      !smokerDrinkerUserData.weight ||
      !smokerDrinkerUserData.waistline ||
      !smokerDrinkerUserData.sight_left ||
      !smokerDrinkerUserData.sight_right ||
      !smokerDrinkerUserData.SBP ||
      !smokerDrinkerUserData.DBP ||
      !smokerDrinkerUserData.BLDS ||
      !smokerDrinkerUserData.tot_chole ||
      !smokerDrinkerUserData.HDL_chole ||
      !smokerDrinkerUserData.LDL_chole ||
      !smokerDrinkerUserData.triglyceride ||
      !smokerDrinkerUserData.hemoglobin ||
      !smokerDrinkerUserData.serum_creatinine ||
      !smokerDrinkerUserData.SGOT_AST ||
      !smokerDrinkerUserData.SGOT_ALT ||
      !smokerDrinkerUserData.gamma_GTP
    ) {
      var updatedIsAllFieldsFilled = Array(19).fill(false);
      Object.entries(smokerDrinkerUserData).forEach(([key, value]) => {
        const index = Object.keys(smokerDrinkerUserData).indexOf(key);
        updatedIsAllFieldsFilled[index] = value === "";
      });
      setIsAllFieldsFilled(updatedIsAllFieldsFilled);
      NotificationHandler("Error", "Please fill all the fields", "Error");
      return;
    }
    const response = await predictSmokerDrinker(smokerDrinkerUserData);
    console.log(response);
    setSmokerDrinkerResult(response);
    setShowSmokerDrinker(true);
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["hack-details"]}>
        <h1>Smoke Drink Predictor Details</h1>
      </div>
      <div className={classes["predictor-form"]}>
        {userData.map((data, index_i) => {
          return (
            <div className={classes["predictor-form-subpart"]} key={index_i}>
              <h3>{data.section}</h3>
              <div className={classes["predictor-form-subpart-items"]}>
                {data.fields.map((item, index_j) => {
                  const index = Object.keys(smokerDrinkerUserData).indexOf(
                    item.id
                  );
                  return (
                    <div
                      className={`${
                        isAllFieldsFilled[index]
                          ? classes["warning"]
                          : classes["input-field-container"]
                      }`}
                      key={index_j}
                    >
                      <label htmlFor="defect">{item.label}</label>
                      <input
                        type="number"
                        min={0}
                        id={item.id}
                        placeholder={"Please fill " + item.label}
                        value={smokerDrinkerUserData[item.id]}
                        onChange={(e) => {
                          setSmokerDrinkerUserData({
                            ...smokerDrinkerUserData,
                            [item.id]: e.target.value,
                          });
                          setIsAllFieldsFilled((prev) => {
                            const updatedArray = [...prev];
                            updatedArray[index] = e.target.value === "";
                            return updatedArray;
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className={classes["btn-group"]}>
        <button className={classes["next-btn"]} onClick={onSubmit}>
          Predict
        </button>
      </div>
    </div>
  );
};

export default Formfill;

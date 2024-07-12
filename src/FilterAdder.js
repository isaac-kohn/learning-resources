import { useState, useEffect, useRef } from "react";
import colors from "./styles/Filter.module.css";
import styles from "./styles/Filter.module.css";

// outside click detector adapted from stack overflow solution: https://stackoverflow.com/questions/32553158/detect-click-outside-react-component?page=1&tab=scoredesc#tab-top
function useCloseOnOutsideClick(ref) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        ref.current.style.display = "none";
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

function Filter({
  filterCategory = "Subject",
  filterOnClicks = ["Mathematics", () => null],
}) {
  const wrapperRef = useRef(null);
  useCloseOnOutsideClick(wrapperRef);
  return (
    <div style={{ display: "inline-block" }}>
      <button
        style={{
          fontFamily: "myriad-pro, inter-variable sans-serif",
          fontSize: "3.5vh",
          padding: "1vw",
          margin: "0.5vw",
          cursor: "pointer",
        }}
        className={colors[filterCategory]}
        onClick={() =>
          wrapperRef.current.style.display === "none"
            ? (wrapperRef.current.style.display = "block")
            : (wrapperRef.current.style.display = "none")
        }
      >
        {filterCategory} +
      </button>
      <div
        ref={wrapperRef}
        style={{
          position: "absolute",
          padding: "1.5vh",
          backgroundColor: "#ffffff",
          borderColor: "000000",
          border: "solid",
          display: "none",
        }}
      >
        {filterOnClicks.map((item, i) => {
          const [subFilterName, onClickFn] = item;

          return (
            <button
              key={i}
              onClick={onClickFn}
              style={{ display: "block", cursor: "pointer", fontSize: "2vh" }}
              className={colors[filterCategory]}
            >
              {subFilterName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Filter;

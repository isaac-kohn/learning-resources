import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ResourceTile from "./ResourceTile.js";
import Filter from "./Filter.js";
import FilterAdder from "./FilterAdder.js";
import parseCSV from "./utils/parseCSV.js";
import filterListInitial from "./constant/filterListInitial.js";
import filterType from "./constant/filterType.js";
import styles from "./styles/App.module.css";

function App() {
  const [CSVData, setCSVData] = useState();
  const [displayPageNumber, setDisplayPageNumber] = useState(0);
  const [pagesPerSlide, setPagesPerSlide] = useState(5);
  const [filterList, setFilterList] = useState(filterListInitial);
  useEffect(() => {
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRai6cqDKJpBR-PuYStigQ2Nx0yFeDv8s7yQSCaZhOCpOEaPnjf7HygCMlmoRRa5FZ2UffQISHwYNfK/pub?output=csv"; // Replace with your Google Sheets CSV file URL

    axios
      .get(csvUrl) // Use Axios to fetch the CSV data
      .then((response) => {
        const parsedCsvData = parseCSV(response.data); // Parse the CSV data into an array of objects

        setCSVData(parsedCsvData); // Set the fetched data in the component's state
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
      });
  }, []);

  let filteredCSVDataNew = useMemo(() => {
    if (!CSVData) {
      return undefined;
    }

    function filterCSVData(CSVData) {
      let filteredCSVData = [];

      let filterIteration = [CSVData];

      let i = 0;
      for (let filterCategory in filterList) {
        let isAtLeastOneFilter = false;
        for (let filterBy in filterList[filterCategory]) {
          if (filterList[filterCategory][filterBy]) {
            isAtLeastOneFilter = true;
            break;
          }
        }
        // Exclusive filter removes all resources that don't have every filterBy of a given filterCategory
        // That is, each resource must have filterBy1 AND filterBy2 AND filterBy3 ...
        if (filterType[filterCategory] === "Exclusive") {
          for (let filterBy in filterList[filterCategory]) {
            if (filterList[filterCategory][filterBy]) {
              filterIteration[i + 1] = filterIteration[i].filter((value) =>
                value[filterCategory]
                  .toLowerCase()
                  .includes(filterBy.toLowerCase())
              );
              i++;
            }
          }
        }
        // Inclusive filter removes resources only if they have no filterBy of a given filterCategory
        // That is, each resource must have filterBy1 OR filterBy2 OR filterBy3 ...
        else if (
          filterType[filterCategory] === "Inclusive" &&
          isAtLeastOneFilter
        ) {
          filterIteration[i + 1] = filterIteration[i].filter((value) => {
            let included = false;
            for (let filterBy in filterList[filterCategory]) {
              if (filterList[filterCategory][filterBy]) {
                included =
                  included ||
                  value[filterCategory]
                    .toLowerCase()
                    .includes(filterBy.toLowerCase());
              }
            }
            return included;
          });
          i++;
        }
      }
      filteredCSVData = filterIteration[filterIteration.length - 1];
      return filteredCSVData;
    }

    return filterCSVData(CSVData);
  }, [CSVData, filterList]);

  useEffect(() => {
    setDisplayPageNumber(0);
  }, [filteredCSVDataNew]);

  const totalPages = filteredCSVDataNew?.length;

  if (!filteredCSVDataNew) {
    return <span>Loading...</span>;
  }

  const loadFilterAdders = () => {
    return (
      <div>
        {Object.entries(filterList).map((filterCategory, i) => (
          <FilterAdder
            key={i}
            filterCategory={filterCategory[0]}
            filterOnClicks={Object.entries(filterCategory[1]).map(
              (filterBy) => [
                filterBy[0],
                () => {
                  setFilterList((prev) => {
                    const newFilterList = JSON.parse(
                      JSON.stringify({ ...prev })
                    );

                    newFilterList[filterCategory[0]][filterBy[0]] = true;
                    return newFilterList;
                  });
                },
              ]
            )}
          />
        ))}
      </div>
    );
  };

  const loadFilters = () => {
    return (
      <div>
        {Object.entries(filterList).map((filterCategory) =>
          Object.entries(filterCategory[1]).map((filterBy, i) => (
            <Filter
              key={i}
              filterCategory={filterCategory[0]}
              filterBy={filterBy[0]}
              onClick={(event) => {
                setFilterList((prev) => {
                  const newFilterList = JSON.parse(JSON.stringify({ ...prev }));
                  newFilterList[filterCategory[0]][filterBy[0]] = false;
                  return newFilterList;
                });
                event.target.parentElement.style.display = "none";
              }}
              displayed={filterList[filterCategory[0]][filterBy[0]]}
            />
          ))
        )}
      </div>
    );
  };

  const clickToPrevSlide = () => {
    setDisplayPageNumber((prev) =>
      prev - pagesPerSlide > 0 ? prev - pagesPerSlide : 0
    );
  };
  const clickToNextSlide = () => {
    setDisplayPageNumber((prev) =>
      prev + pagesPerSlide + 1 <= totalPages ? prev + pagesPerSlide : prev
    );
  };

  return (
    <div className={styles.app}>
      <div className={styles.filterToolDiv}>
        {/* filter container */}
        <h1 style={{ fontSize: "7vh", textAlign: "center" }}>
          Search Resource Library
        </h1>
        <div
          style={{
            textAlign: "center",
            fontSize: "3vh",
            paddingBottom: "2vh",
            color: "#898989",
          }}
        >
          Add Search Filters:
        </div>
        <div style={{ textAlign: "center" }}>{loadFilterAdders()}</div>
        <div className={styles.filterContainer}>{loadFilters()}</div>
        <button
          className={styles.reset}
          onClick={() => {
            setFilterList(filterListInitial);
            setDisplayPageNumber(0);
          }}
        >
          Reset Search
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "3vh",
          padding: "1vh",
          color: "red",
          display: totalPages === 0 ? "block" : "none",
        }}
      >
        Drat! There are no results that match all of your specifications. Try
        removing some.
      </div>

      <div className={styles.pageContainer}>
        {/* pages */}
        {filteredCSVDataNew
          .slice(
            displayPageNumber,
            displayPageNumber + pagesPerSlide + 1 <= totalPages
              ? displayPageNumber + pagesPerSlide
              : totalPages
          )
          .map((item, index) => (
            <ResourceTile key={`${item.Title}${index}`} CSVItem={item} />
          ))}
      </div>

      <div className={styles.pageRangeBar}>
        {/* page selector */}
        <button onClick={clickToPrevSlide} className={styles.scrollButton}>
          {" "}
          &#60;{" "}
        </button>
        <span style={{ textAlign: "center", fontSize: "2.25vh" }}>
          Showing Pages {displayPageNumber + 1} to{" "}
          {displayPageNumber + pagesPerSlide + 1 <= totalPages
            ? displayPageNumber + pagesPerSlide
            : totalPages}{" "}
          of {totalPages}{" "}
        </span>
        <button onClick={clickToNextSlide} className={styles.scrollButton}>
          {" "}
          &#62;{" "}
        </button>
      </div>
    </div>
  );
}

export default App;

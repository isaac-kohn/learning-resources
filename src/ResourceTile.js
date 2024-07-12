import styles from "./styles/App.module.css";

function ResourceTile({ CSVItem }) {
  return (
    <div className={styles.resourceTile}>
      <a
        style={{ textDecoration: "none" }}
        href={CSVItem.Address}
        target="_blank"
      >
        <h1 style={{ textDecoration: "underline", fontSize: "3.5vh" }}>
          {CSVItem.Title}
        </h1>
        <p style={{ fontSize: "2vh" }}>{CSVItem.Description}</p>
      </a>
    </div>
  );
}

export default ResourceTile;

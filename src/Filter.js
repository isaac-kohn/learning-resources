import colors from "./styles/Filter.module.css";
import styles from "./styles/App.module.css";

function Filter({
  onClick = () => null,
  filterCategory = "Focus",
  filterBy = "Climate Change",
  displayed = false,
}) {
  return (
    <span
      style={{ display: displayed ? "inline-block" : "none" }}
      className={colors[filterCategory] + " " + styles.filter}
    >
      <span>{filterBy}</span>
      <button
        onClick={onClick}
        style={{ display: displayed ? "inline-block" : "none" }}
        className={styles.filterRemoveButton}
      >
        X
      </button>
    </span>
  );
}

export default Filter;

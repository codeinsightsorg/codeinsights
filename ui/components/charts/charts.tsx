import styles from "./charts.module.css";
import plugins from "../../public/charts.json";
import ChartComponent from "../chart/chart";

export default function Charts() {
  return (
    <div className={styles.plugins}>
      {plugins.map((plugin, index) => (
        <div className={styles.plugin} key={index}>
          <h1 className={styles.pluginName}>{plugin.name}</h1>
          {Object.entries(plugin.charts).map(([type, value]) => (
            <div className={styles.analyzedItemTypeContainer} key={type}>
              <h2 className={styles.typeName}>
                {type} ({value.count})
              </h2>
              <div className={styles.charts}>
                {value.charts.map((chart, index) => (
                  <div className={styles.chart} key={index}>
                    <ChartComponent config={chart} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

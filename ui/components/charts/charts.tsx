import styles from "./charts.module.css";
import ChartComponent from "../chart/chart";
import { useEffect, useState } from "react";

export default function Charts() {
  const [plugins, setPlugins] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/data").then((res) => res.json());
      console.log(response);
      const chartData = response.results.find(
        (item) => item.plugin.plugin.name === "ChartJSPlugin"
      );
      setPlugins(chartData.allPluginsData);
    };

    fetchData().catch(console.error);
  });

  return (
    <div className={styles.plugins}>
      {plugins.length ? (
        plugins.map((plugin: any, index) => (
          <div className={styles.plugin} key={index}>
            <h1 className={styles.pluginName}>{plugin.name}</h1>
            {Object.entries(plugin.charts).map(([type, value]: any) => (
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
        ))
      ) : (
        <div className={styles.loadingContainer}>Loading...</div>
      )}
    </div>
  );
}

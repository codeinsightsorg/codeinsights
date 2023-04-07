import styles from "./charts.module.css";
import ChartComponent from "../chart/chart";
import { useAnalyzeResultsStore } from "../../pages/showcase/analyze-result.state";

export default function Charts() {
  const isLoading = useAnalyzeResultsStore((state) => state.isLoading);
  const analyzeResults = useAnalyzeResultsStore((state) => state.charts);

  return (
    <div className={styles.plugins}>
      {!isLoading && analyzeResults?.length ? (
        analyzeResults.map((plugin, index) => (
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
        ))
      ) : (
        <div className={styles.loadingContainer}>Loading...</div>
      )}
    </div>
  );
}

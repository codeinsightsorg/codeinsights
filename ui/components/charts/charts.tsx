import styles from "./charts.module.css";
import ChartComponent from "../chart/chart";
import { useAnalyzeResultsStore } from "../../pages/explore/analyze-result.state";
import { useSuggestionsListStore } from "../search-dialog/state";
import { useEffect, useState } from "react";

interface ChartsProps {
  toggleDialog: () => void;
}

export default function Charts(props: ChartsProps) {
  const isLoading = useAnalyzeResultsStore((state) => state.isLoading);
  const analyzeResults = useAnalyzeResultsStore((state) => state.charts);
  const currentSuggestion = useSuggestionsListStore((state) => state.current);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const isMac = navigator.userAgent.indexOf("Mac OS X") != -1;
    setIsMac(isMac);
  }, []);

  return (
    <>
      {currentSuggestion ? (
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
      ) : (
        <div className={styles.initialSearch} onClick={props.toggleDialog}>
          <span>Click here, or press</span>
          &nbsp;
          <span className={styles.shortcutKey}>
            {isMac ? "cmd+k" : "ctrl+k"}
          </span>
          &nbsp;
          <span>to start</span>
        </div>
      )}
    </>
  );
}

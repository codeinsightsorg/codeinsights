import Charts from "../../components/charts/charts";
import Image from "next/image";
import styles from "./showcase.module.scss";
import { useEffect, useRef } from "react";
import { SearchDialog } from "../../components/search-dialog/search-dialog";
import { CommandBarMethods } from "../../shared/types/search-dialog.types";
import { useAnalyzeResultsStore } from "./analyze-result.state";
import {
  SearchSuggestion,
  useSuggestionsListStore,
} from "../../components/search-dialog/state";
import { useRouter } from "next/router";
import { getGithubRepoNameFromURL } from "../../components/search-dialog/utils";

export default function Index() {
  const searchDialogRef = useRef<CommandBarMethods>();
  const getAnalyzeResults = useAnalyzeResultsStore(
    (state) => state.getAnalyzeResults
  );
  const currentSuggestion = useSuggestionsListStore((state) => state.current);
  const router = useRouter();
  const setCurrentSuggestion = useSuggestionsListStore(
    (state) => state.setCurrentSuggestion
  );

  useEffect(() => {
    if (!router.isReady) return;
    const repo = router.query.repo as string;
    if (repo) {
      const newSuggestion: SearchSuggestion = {
        type: "repo",
        url: repo,
        name: getGithubRepoNameFromURL(repo),
      };
      setCurrentSuggestion(newSuggestion);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!currentSuggestion) {
      return;
    }
    if (currentSuggestion.type === "npm") {
      getAnalyzeResults(currentSuggestion.githubURL).then();
    } else {
      getAnalyzeResults(currentSuggestion.url).then();
    }
  }, [currentSuggestion]);

  function toggleDialog() {
    searchDialogRef.current.toggle();
  }

  return (
    <div className={styles.mainContainer}>
      <SearchDialog ref={searchDialogRef}>
        <div className={styles.logoContainer}>
          <nav>
            <a href="/" target="_blank">
              Docs
            </a>
          </nav>
          <Image src="/Logo.png" width={375} alt={"logo"} height={120} />
          <button onClick={toggleDialog} className={styles.searchBtn}>
            Search
          </button>
        </div>
        {currentSuggestion?.type === "npm" && (
          <div className={styles.currentSuggestion}>
            <h1>{currentSuggestion.name}</h1>
            <p>{currentSuggestion.githubURL}</p>
            <p>{currentSuggestion.description}</p>
          </div>
        )}
        {currentSuggestion?.type === "repo" && (
          <div className={styles.currentSuggestion}>
            <h1>{currentSuggestion.name}</h1>
            <p>{currentSuggestion.url}</p>
            <h1>{currentSuggestion.description}</h1>
          </div>
        )}
        <Charts toggleDialog={toggleDialog} />
      </SearchDialog>
    </div>
  );
}

import Charts from "../../components/charts/charts";
import Image from "next/image";
import styles from "./showcase.module.scss";
import { useRef } from "react";
import { SearchDialog } from "../../components/search-dialog/search-dialog";
import { CommandBarMethods } from "../../shared/types/search-dialog.types";

export default function Index() {
  const searchDialogRef = useRef<CommandBarMethods>();

  function toggleDialog() {
    searchDialogRef.current.toggle();
  }

  return (
    <>
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
        <Charts />
      </SearchDialog>
    </>
  );
}

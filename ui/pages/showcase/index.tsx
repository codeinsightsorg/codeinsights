import Charts from "../../components/charts/charts";
import Image from "next/image";
import styles from "./showcase.module.scss";
export default function Index() {
  return (
    <>
      <div className={styles.logoContainer}>
        <nav>
          <a href="/" target="_blank">
            Docs
          </a>
        </nav>
        <Image src="/Logo.png" width={375} alt={"logo"} height={120} />
        <div></div>
      </div>
      <Charts />
    </>
  );
}

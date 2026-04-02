import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <MainContent />
    </div>
  );
}

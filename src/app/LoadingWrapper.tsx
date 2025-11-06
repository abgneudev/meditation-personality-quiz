'use client';

import { useImagePreloader } from "../hooks/useImagePreloader";
import { IMAGE_PATHS } from "../../lib/image-paths";
import styles from "./layout.module.css";

interface LoadingWrapperProps {
  children: React.ReactNode;
}

export function LoadingWrapper({ children }: LoadingWrapperProps) {
  const { isLoading, loadingProgress } = useImagePreloader(IMAGE_PATHS);

  return (
    <>
      {isLoading && (
        <div className={styles.loadingBar}>
          <div
            className={styles.loadingBarFill}
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}
      {children}
    </>
  );
}
import { useEffect } from "react";

import styles from "./styles.module.css";

interface Props {
  isOpen: boolean;
  closeMenu(): void;
}

function FileMenu(props: Props) {
  const { isOpen, closeMenu } = props;

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.key === "Escape" || e.keyCode === 27) && isOpen) {
        closeMenu();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  return isOpen ? (
    <div className={styles.FileMenu}>
      <button>Open file</button>
      <button disabled>Save file</button>
    </div>
  ) : null;
}

export { FileMenu };

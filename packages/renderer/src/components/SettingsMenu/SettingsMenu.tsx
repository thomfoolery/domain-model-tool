import { useEffect } from "react";

import styles from "./styles.module.css";

interface Props {
  isOpen: boolean;
  closeMenu(): void;
}

function SettingsMenu(props: Props) {
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
    <div className={styles.SettingsMenu}>
      <h1>Settings</h1>
    </div>
  ) : null;
}

export { SettingsMenu };

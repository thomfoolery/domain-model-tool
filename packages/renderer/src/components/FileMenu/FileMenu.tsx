import { useEffect } from "react";

import { useAppAtom } from "@/hooks";
import { saveFile, loadFile, clearState } from "@/state";

import styles from "./styles.module.css";

interface Props {
  isOpen: boolean;
  closeMenu(): void;
}

function FileMenu(props: Props) {
  const { isOpen, closeMenu } = props;
  const [filePath, setFilePath] = useAppAtom("filePath");

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.key === "Escape" || e.keyCode === 27) && isOpen) {
        closeMenu();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  const handleClickNewFile = () => {
    closeMenu();
    clearState();
    window.openFileDialog().then((result) => {
      if (result) {
        const [openFilePath] = result;
        setFilePath(openFilePath);
        saveFile();
      }
    });
  };

  const handleClickOpen = () => {
    closeMenu();
    window.openFileDialog().then((result) => {
      if (result) {
        const [openFilePath] = result;
        setFilePath(openFilePath);
        loadFile(openFilePath);
      }
    });
  };

  const handleClickSave = () => {
    closeMenu();
    saveFile(filePath);
  };

  const handleClickSaveAs = () => {
    closeMenu();
    window.saveFileDialog().then((saveAsFilePath) => {
      if (saveAsFilePath) {
        setFilePath(saveAsFilePath);
        saveFile(saveAsFilePath);
      }
    });
  };

  const handleClickReload = () => {
    closeMenu();
    loadFile(filePath);
  };

  return isOpen ? (
    <div className={styles.FileMenu}>
      <button onClick={handleClickNewFile}>New</button>
      <button onClick={handleClickOpen}>Open</button>
      <button onClick={handleClickSave} disabled={!filePath}>
        Save
      </button>
      <button onClick={handleClickSaveAs}>Save as...</button>
      <button onClick={handleClickReload}>Reload</button>
    </div>
  ) : null;
}

export { FileMenu };

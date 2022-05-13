import { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { clearState, clearGraph } from "@/state";
import { appFilePathState } from "@/state/atoms";
import { useSaveFile, useLoadFile } from "@/hooks";

import styles from "./styles.module.css";

interface Props {
  isOpen: boolean;
  closeMenu(): void;
}

function FileMenu(props: Props) {
  const { isOpen, closeMenu } = props;
  const saveFile = useSaveFile();
  const loadFile = useLoadFile();
  const appFilePath = useRecoilValue(appFilePathState);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.key === "Escape" || e.keyCode === 27) && isOpen) {
        closeMenu();
      }
      if (e.key === "s" && e.metaKey) {
        saveFile(appFilePath);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, appFilePath, closeMenu]);

  const handleClickNewFile = () => {
    closeMenu();
    window.saveFileDialog().then((saveFilePath) => {
      if (saveFilePath) {
        clearState();
        saveFile(saveFilePath);
      }
    });
  };

  const handleClickOpen = () => {
    closeMenu();
    window.openFileDialog().then((result) => {
      if (result) {
        const [openFilePath] = result;
        loadFile(openFilePath);
      }
    });
  };

  const handleClickSave = () => {
    closeMenu();
    saveFile(appFilePath);
  };

  const handleClickSaveAs = () => {
    closeMenu();
    window.saveFileDialog().then((saveFilePath) => {
      if (saveFilePath) {
        saveFile(saveFilePath);
      }
    });
  };

  const handleClickReload = () => {
    closeMenu();
    loadFile(appFilePath);
  };

  const handleClickClear = () => {
    closeMenu();
    clearGraph();
  };

  return isOpen ? (
    <div className={styles.FileMenu}>
      <button onClick={handleClickNewFile}>New</button>
      <button onClick={handleClickOpen}>Open</button>
      <button onClick={handleClickSave} disabled={!appFilePath}>
        Save
      </button>
      <button onClick={handleClickSaveAs}>Save as...</button>
      <button onClick={handleClickReload}>Reload</button>
      <button onClick={handleClickClear}>Clear</button>
    </div>
  ) : null;
}

export { FileMenu };

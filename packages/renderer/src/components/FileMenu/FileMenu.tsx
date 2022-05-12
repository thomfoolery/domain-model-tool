import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { appFilePathState } from "@/state";

import styles from "./styles.module.css";

interface Props {
  isOpen: boolean;
  closeMenu(): void;
}

function FileMenu(props: Props) {
  const { isOpen, closeMenu } = props;
  // const [graphManager] = useGraphManager();
  const [appFilePath, setAppFilePath] = useRecoilState(appFilePathState);

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
    window.saveFileDialog().then((saveAsFilePath) => {
      if (saveAsFilePath) {
        setAppFilePath(saveAsFilePath);
        // clearState(graphManager);
        // saveFile();
      }
    });
  };

  const handleClickOpen = () => {
    closeMenu();
    window.openFileDialog().then((result) => {
      if (result) {
        const [openFilePath] = result;
        setAppFilePath(openFilePath);
        // loadFile(openFilePath, graphManager);
      }
    });
  };

  const handleClickSave = () => {
    closeMenu();
    // saveFile(appFilePath);
  };

  const handleClickSaveAs = () => {
    closeMenu();
    window.saveFileDialog().then((saveAsFilePath) => {
      if (saveAsFilePath) {
        setAppFilePath(saveAsFilePath);
        // saveFile(saveAsFilePath);
      }
    });
  };

  const handleClickReload = () => {
    closeMenu();
    // loadFile(filePath, graphManager);
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
    </div>
  ) : null;
}

export { FileMenu };

import { useCallback } from "react";
import { getRecoil, setRecoil } from "recoil-nexus";

import {
  nodeDataState,
  graphDataState,
  appFilePathState,
  graphManagerState,
  nodeAtomFamilyHashTable,
} from "@/state/atoms";

import { isFileContentsValid } from "@/utils";

function useLoadFile() {
  return useCallback((appFilePath: String) => {
    try {
      const graphManager = getRecoil(graphManagerState);
      const fileContent = window.fs.readFileSync(appFilePath, {
        encoding: "utf8",
      });
      const fileContentJson = JSON.parse(fileContent);

      if (isFileContentsValid(fileContentJson)) {
        console.error(`Invalid file schema @ ${appFilePath}`);
        return; //exit
      }

      const { nodeData, graphData } = fileContentJson;

      setRecoil(appFilePathState, appFilePath);
      setRecoil(graphDataState, graphData);
      setRecoil(nodeDataState, nodeData);
      graphManager.import(graphData);

      Object.entries(nodeData).forEach(([nodeId, data]) => {
        Object.entries(data).forEach(([key, value]) => {
          const atomFamily = nodeAtomFamilyHashTable[key];
          setRecoil(atomFamily(nodeId), value);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
}

export { useLoadFile };

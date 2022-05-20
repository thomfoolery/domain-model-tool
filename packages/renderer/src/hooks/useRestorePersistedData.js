import { useEffect } from "react";
import { setRecoil } from "recoil-nexus";

import {
  graphDataState,
  appFilePathState,
  nodeAtomFamilyHashTable,
} from "@/state/atoms";
import { PERSISTED_STATE } from "@/constants";

function useRestorePersistedData() {
  useEffect(() => {
    const { appFilePath, graphData, nodeData } = PERSISTED_STATE;

    // appFilePath
    if (appFilePath) {
      setRecoil(appFilePathState, appFilePath);
    }

    // graphData
    if (Array.isArray(graphData.nodes) && Array.isArray(graphData.edges)) {
      setRecoil(graphDataState, graphData);
    } else {
      setRecoil(graphDataState, {
        nodes: [],
        edges: [],
      });
    }

    // nodeData
    if (nodeData) {
      Object.entries(nodeData).forEach(([nodeId, data]) => {
        Object.entries(data).forEach(([key, value]) => {
          const atomFamily = nodeAtomFamilyHashTable[key];
          if (atomFamily) {
            setRecoil(atomFamily(nodeId), value);
          }
        });
      });
    }
  }, []);
}

export { useRestorePersistedData };

import { useCallback } from "react";
import { getRecoil, setRecoil } from "recoil-nexus";

import { graphDataState, nodeDataState, appFilePathState } from "@/state/atoms";

function useSaveFile() {
  return useCallback((appFilePath: string) => {
    const graphData = getRecoil(graphDataState);
    const nodeData = getRecoil(nodeDataState);

    const state = JSON.stringify({
      graphData,
      nodeData,
    });

    setRecoil(appFilePathState, appFilePath);
    window.fs.writeFileSync(appFilePath, state);
  }, []);
}

export { useSaveFile };

import { useCallback } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

import { appFilePathState, graphManagerState } from "@/state";

function useLoadFile() {
  const setAppFilePath = useSetRecoilState(appFilePathState);
  const graphManager = useRecoilValue(graphManagerState);

  return useCallback(
    (filePath: string) => {
      const { graphData } = window.fs.readFileSync(filePath, {
        encoding: "utf8",
      });

      graphManager.import(graphData);
      setAppFilePath(filePath);
    },
    [graphManager, setAppFilePath]
  );
}

export { useLoadFile };

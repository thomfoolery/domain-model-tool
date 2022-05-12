import { useRecoilValue } from "recoil";

import { appFilePathState } from "@/state";

function useSaveFile() {
  const [appFilePath] = useRecoilValue(appFilePathState);

  return () => {
    const serializedState = "{}";
    window.fs.writeFileSync(appFilePath, serializedState);
  };
}

export { useSaveFile };

import { useRecoilState } from "recoil";

import { nodeAtomFamilyHashTable } from "@/state/atoms";

function useNodeState(nodeId: string, key: string) {
  const atomFamilyInstance = nodeAtomFamilyHashTable[key];

  if (!atomFamilyInstance) {
    throw Error(`Key '${key}' is not supported`);
  }

  return useRecoilState(atomFamilyInstance(nodeId));
}

export { useNodeState };

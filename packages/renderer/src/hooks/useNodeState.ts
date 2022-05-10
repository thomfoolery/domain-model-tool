import { useRecoilState } from "recoil";

import { getNodeAtom, saveLocalStorage, updateGraphNodeData } from "@/state";

function useNodeState(nodeId: string, key: string) {
  const nodeState = getNodeAtom(nodeId);

  if (nodeState && nodeState[key]) {
    const [value, setter] = useRecoilState(nodeState[key]);

    return [
      value,
      (valueOrFn: any) => {
        if (typeof valueOrFn === "function") {
          return setter((currentValue: any) => {
            const value = valueOrFn(currentValue);

            updateGraphNodeData(nodeId, key, value);
            saveLocalStorage();
            return value;
          });
        }

        updateGraphNodeData(nodeId, key, valueOrFn);
        saveLocalStorage();
        return setter(valueOrFn);
      },
    ];
  }

  console.log(`Node state for ${nodeId}.${key} does not exist.`);
  return [null, () => null];
}

export { useNodeState };

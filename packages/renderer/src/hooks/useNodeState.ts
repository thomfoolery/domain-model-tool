import { atomFamily, useRecoilState } from "recoil";

import { updateNodeData } from "@/state";

const nodeLabelAtom = atomFamily({
  key: "label",
  default: "",
  effects: (nodeId: string) => [
    ({ onSet }) => {
      onSet((value: string) => updateNodeData(nodeId, `label`, value));
    },
  ],
});

const nodeDescriptionAtom = atomFamily({
  key: "description",
  default: "",
  effects: (nodeId: string) => [
    ({ onSet }) => {
      onSet((value: string) => updateNodeData(nodeId, `descriptions`, value));
    },
  ],
});

const atomHashTable: any = {
  label: nodeLabelAtom,
  description: nodeDescriptionAtom,
};

function useNodeState(nodeId: string, key: string) {
  const atomFamilyInstance = atomHashTable[key];

  if (!atomFamilyInstance) {
    throw Error(`Key '${key}' is not supported`);
  }

  return useRecoilState(atomFamilyInstance(nodeId));
}

export { useNodeState };

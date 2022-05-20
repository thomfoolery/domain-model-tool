import { atom, atomFamily } from "recoil";

import { PERSISTED_STATE } from "@/constants";
import { persistData, updateNodeData } from "@/state";

const nodeDataState = atom({
  key: "nodeData",
  default: PERSISTED_STATE.nodeData,
});

const graphDataState = atom({
  key: "graphData",
  default: PERSISTED_STATE.graphData,
  dangerouslyAllowMutability: true,
});

const appFilePathState = atom({
  key: "appFilePath",
  default: "",
  effects: [
    ({ onSet }) =>
      onSet((value: string) => {
        persistData();
      }),
  ],
});

const graphManagerState = atom({
  key: "graphManager",
  default: null,
});

const nodeSizeAtomFamily = atomFamily({
  key: "size",
  default: "md",
  effects: (nodeId: string) => [
    ({ onSet }) =>
      onSet((value: string) => updateNodeData(nodeId, `size`, value)),
  ],
});

const nodeColorAtomFamily = atomFamily({
  key: "color",
  default: "green",
  effects: (nodeId: string) => [
    ({ onSet }) =>
      onSet((value: string) => updateNodeData(nodeId, `color`, value)),
  ],
});

const nodeLabelAtomFamily = atomFamily({
  key: "label",
  default: "",
  effects: (nodeId: string) => [
    ({ onSet }) =>
      onSet((value: string) => updateNodeData(nodeId, `label`, value)),
  ],
});

const nodeDescriptionAtomFamily = atomFamily({
  key: "description",
  default: "",
  effects: (nodeId: string) => [
    ({ onSet }) =>
      onSet((value: string) => updateNodeData(nodeId, `descriptions`, value)),
  ],
});

const nodeAtomFamilyHashTable: any = {
  size: nodeSizeAtomFamily,
  color: nodeColorAtomFamily,
  label: nodeLabelAtomFamily,
  description: nodeDescriptionAtomFamily,
};

export {
  nodeDataState,
  graphDataState,
  appFilePathState,
  graphManagerState,
  nodeSizeAtomFamily,
  nodeColorAtomFamily,
  nodeLabelAtomFamily,
  nodeDescriptionAtomFamily,
  nodeAtomFamilyHashTable,
};

import { atom } from "recoil";

const appFilePathState = atom({ key: "appFilePath", default: "" });
const graphManagerState = atom({ key: "graphManager", default: null });

const NODE_DATA: any = {};

function updateNodeData(nodeId: string, key: string, value: any) {
  if (!NODE_DATA[nodeId]) NODE_DATA[nodeId] = {};

  NODE_DATA[nodeId][key] = value;
}

function removeNodeData(nodeId: string) {
  delete NODE_DATA[nodeId];
}

export { appFilePathState, graphManagerState, updateNodeData, removeNodeData };

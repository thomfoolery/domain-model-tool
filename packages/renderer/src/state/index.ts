import { getRecoil, setRecoil } from "recoil-nexus";

import {
  nodeDataState,
  graphDataState,
  appFilePathState,
  graphManagerState,
} from "@/state/atoms";

function updateNodeData(nodeId: string, key: string, value: any) {
  setRecoil(nodeDataState, (nodeData) => {
    persistData();
    return !nodeData[nodeId]
      ? { ...nodeData, [nodeId]: { [key]: value } }
      : { ...nodeData, [nodeId]: { ...nodeData[nodeId], [key]: value } };
  });
}

function removeNodeData(nodeId: string) {
  setRecoil(nodeDataState, (nodeData) => {
    persistData();
    return { ...nodeData, [nodeId]: undefined };
  });
}

function clearState() {
  const graphManager = getRecoil(graphManagerState);

  setRecoil(appFilePathState, "");
  setRecoil(graphDataState, { nodes: [], edges: [] });
  setRecoil(nodeDataState, {});

  graphManager.import({ nodes: [], edges: [] });
}

function clearGraph() {
  const graphManager = getRecoil(graphManagerState);

  setRecoil(graphDataState, { nodes: [], edges: [] });
  setRecoil(nodeDataState, {});

  graphManager.import({ nodes: [], edges: [] });
}

let debounceTimeout: any = null;
const DEBOUNCE_DURATION = 2000;

function persistData() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    const appFilePath = getRecoil(appFilePathState);
    const graphData = getRecoil(graphDataState);
    const nodeData = getRecoil(nodeDataState);
    const state = JSON.stringify({
      appFilePath,
      graphData,
      nodeData,
    });

    localStorage.setItem("state", state);
    debounceTimeout = null;
  }, DEBOUNCE_DURATION);
}

export { updateNodeData, removeNodeData, clearState, clearGraph, persistData };

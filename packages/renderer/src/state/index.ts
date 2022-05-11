import { atom } from "recoil";

let initialGraph = {
  nodes: [],
  edges: [],
};

const APP_DATA = {
  filePath: "",
};
const APP_ATOMS = {
  filePath: atom({ key: "filePath", default: APP_DATA.filePath }),
};

const NODE_DATA = {};
const NODE_ATOMS = {};

const GRAPH_STATE = {
  value: initialGraph,
};

function getAppAtom(key: string): any {
  return APP_ATOMS[key];
}

function updateAppData(key: string, value: any) {
  APP_DATA[key] = value;
}

function getNodeAtom(nodeId: string) {
  if (NODE_ATOMS[nodeId] === undefined) {
    NODE_ATOMS[nodeId] = {
      label: atom({ key: `${nodeId}-label`, default: "" }),
      description: atom({ key: `${nodeId}-description`, default: "" }),
    };
  }

  return NODE_ATOMS[nodeId];
}

function updateNodeData(nodeId: string, key: string, value: any) {
  if (NODE_DATA[nodeId] === undefined) {
    NODE_DATA[nodeId] = {};
  }

  const node = NODE_DATA[nodeId];

  node[key] = value;
}

function setGraphState(newGraphState: any) {
  GRAPH_STATE.value = newGraphState;
  saveLocalStorage();
}

function getSerializedState() {
  return `${JSON.stringify({
    nodeData: NODE_DATA,
    graphData: GRAPH_STATE.value,
  })}`;
}
function loadAppData(appData) {
  if (appData) {
    Object.entries(appData).map(([key, value]) => {
      APP_DATA[key] = value;
      APP_ATOMS[key] = atom({ key, default: value || "" });
    });
  }
}

function loadNodeData(nodeData) {
  if (nodeData) {
    Object.entries(nodeData).map(([nodeId, data]) => {
      NODE_DATA[nodeId] = data;
      NODE_ATOMS[nodeId] = {
        label: atom({ key: `${nodeId}-label`, default: data.label || "" }),
        description: atom({
          key: `${nodeId}-description`,
          default: data.description || "",
        }),
      };
    });
  }
}

function loadGraphData(graphData) {
  initialGraph = graphData;
}

function saveLocalStorage() {
  const state = `${JSON.stringify({
    appData: APP_DATA,
    nodeData: NODE_DATA,
    graphData: GRAPH_STATE.value,
  })}`;

  localStorage.setItem("state", state);
}

function loadLocalStorage() {
  const stateSerialized: string | null = localStorage.getItem("state");

  try {
    const { appData, nodeData, graphData } = JSON.parse(stateSerialized);

    loadAppData(appData);
    loadNodeData(nodeData);
    loadGraphData(graphData);
  } catch (error) {
    console.error(error);
  }
}

function saveFile(filePath: string) {
  const serializedState = getSerializedState();
  window.fs.writeFileSync(filePath, serializedState);
}

function loadFile(fileContents: string) {
  try {
    const { nodeData, graphData } = JSON.parse(fileContents);

    loadNodeData(nodeData);
    loadGraphData(graphData);
  } catch (error) {
    console.error(error);
  }
}

function clearState() {
  APP_DATA = {};
  APP_ATOMS = {};
  NODE_DATA = {};
  NODE_ATOMS = {};
}

loadLocalStorage();

export {
  initialGraph,
  saveFile,
  loadFile,
  clearState,
  getAppAtom,
  updateAppData,
  getNodeAtom,
  updateNodeData,
  setGraphState,
  saveLocalStorage,
  getSerializedState,
};

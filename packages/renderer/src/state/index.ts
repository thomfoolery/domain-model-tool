import { atom } from "recoil";

const NODE_DATA = {};
const NODE_ATOMS = {};
const initialGraph = loadLocalStorage();

const GRAPH_STATE = {
  value: initialGraph,
};

function setGraphState(newGraphState: any) {
  GRAPH_STATE.value = newGraphState;
  saveLocalStorage();
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

function updateGraphNodeData(nodeId: string, key: string, value: any) {
  if (NODE_DATA[nodeId] === undefined) {
    NODE_DATA[nodeId] = {};
  }

  const node = NODE_DATA[nodeId];

  node[key] = value;
}

function saveLocalStorage() {
  const serializedState = `${JSON.stringify({
    nodeData: NODE_DATA,
    graphState: GRAPH_STATE.value,
  })}`;

  localStorage.setItem("state", serializedState);
}

function loadLocalStorage() {
  const stateSerialized: string | null = localStorage.getItem("state");

  try {
    const { graphState, nodeData } = JSON.parse(stateSerialized);

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

    return graphState;
  } catch (error) {
    console.log(error);
  }

  return {
    nodes: [],
    edges: [],
  };
}

export {
  initialGraph,
  getNodeAtom,
  setGraphState,
  saveLocalStorage,
  updateGraphNodeData,
};

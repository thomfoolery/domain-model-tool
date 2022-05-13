let PERSISTED_STATE: any = {
  appFilePath: "",
  nodeData: {},
  graphData: {
    nodes: [],
    edges: [],
  },
};

try {
  PERSISTED_STATE =
    JSON.parse(localStorage.getItem("state")) || PERSISTED_STATE;
} catch (error) {
  console.error(error);
}

export { PERSISTED_STATE };

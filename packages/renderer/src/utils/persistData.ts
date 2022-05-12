function persistData({
  appFilePath = "",
  nodeData = {},
  graphData = { nodes: [], edges: [] },
}) {
  const state = JSON.stringify({ appFilePath, nodeData, graphData });

  localStorage.setItem("state", state);
}

export { persistData };

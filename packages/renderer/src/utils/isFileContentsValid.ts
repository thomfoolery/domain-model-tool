function isFileContentsValid(fileContentJson: any): boolean {
  const { nodeData, graphData } = fileContentJson;

  return (
    !nodeData ||
    !Array.isArray(graphData.nodes) ||
    !Array.isArray(graphData.edges)
  );
}

export { isFileContentsValid };

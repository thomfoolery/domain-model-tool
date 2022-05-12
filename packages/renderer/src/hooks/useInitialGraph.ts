import { useMemo } from "react";

function useInitialGraph() {
  return useMemo(
    () => ({
      nodes: [],
      edges: [],
    }),
    []
  );
}

export { useInitialGraph };

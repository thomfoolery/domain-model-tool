import { useContext } from "react";

import { graphManagerContext } from "@/context";

function useGraphManager() {
  return useContext(graphManagerContext);
}

export { useGraphManager };

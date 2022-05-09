import { createContext, useContext } from "react";

const graphManagerContext = createContext(null);
const GraphManagerContextProvider = graphManagerContext.Provider;

function useGraphManager() {
  return useContext(graphManagerContext);
}

export { useGraphManager, GraphManagerContextProvider };

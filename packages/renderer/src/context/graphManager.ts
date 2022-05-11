import { createContext } from "react";

const graphManagerContext = createContext(null);
const GraphManagerContextProvider = graphManagerContext.Provider;

export { graphManagerContext, GraphManagerContextProvider };

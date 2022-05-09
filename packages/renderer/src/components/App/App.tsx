import { useState } from "react";
import { NetworkCanvas } from "react-network-canvas";
import { v1 as generateUuid } from "uuid";

import { Node, Port } from "@/components";
import { GraphManagerContextProvider } from "@/context";

import styles from "./styles.module.css";

const App = () => {
  const [graphManager, setGraphManager] = useState(null);

  const nodes: any[] = [];
  const edges: any[] = [];

  const callbacks = {
    onMount(graphManager: any) {
      setGraphManager(graphManager);
    },
    onClickCanvas(event, position, graphManager) {
      // create node at click position
      const node = graphManager.createNode({
        position,
        inputPorts: [
          { id: generateUuid() },
          { id: generateUuid() },
          { id: generateUuid() },
          { id: generateUuid() },
        ],
        outputPorts: [
          { id: generateUuid() },
          { id: generateUuid() },
          { id: generateUuid() },
          { id: generateUuid() },
        ],
      });

      // select the newly created node
      graphManager.selectedNodeIds = [node.id];
    },
    onClickPort(event, port, parentNode, graphManager) {
      console.log(event, port, parentNode);
      // create a connected node...
    },
    onKeyPress(event, key, graphManager) {
      console.log(event, key);
      if (key === "Backspace" && graphManager.selectedNodeIds.length > 0) {
        // delete selected nodes
        graphManager.removeNodesByIds(graphManager.selectedNodeIds);
      }
    },
  };

  const options = {
    canvasSize: 5000,
    gridSize: 20,
    zoomWheelKey: "Shift",
    selectBoxKey: "Shift",
    isSnapToGridEnabled: true,
    minZoom: 0.25,
    maxZoom: 1.5,
    NodeComponent: Node,
    PortComponent: Port,
  };

  console.log(graphManager);

  return (
    <div className={styles.App}>
      <GraphManagerContextProvider value={graphManager}>
        <NetworkCanvas
          nodes={nodes}
          edges={edges}
          options={options}
          {...callbacks}
        />
      </GraphManagerContextProvider>
    </div>
  );
};

export { App };

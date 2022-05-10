import { useState } from "react";
import { RecoilRoot } from "recoil";
import { v1 as generateUuid } from "uuid";
import { NetworkCanvas } from "react-network-canvas";

import { isFormElementActive } from "@/utils";
import { Node, Port, Inspector } from "@/components";
import { GraphManagerContextProvider } from "@/context";
import { initialGraph, setGraphState } from "@/state";

import styles from "./styles.module.css";
import { theme } from "./theme";

const App = () => {
  const [graphManager, setGraphManager] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const callbacks = {
    onMount(graphManager: any) {
      setGraphManager(graphManager);
    },

    onChangeSelectedNodeIds(selectedNodeIds: string[], graphManager: any) {
      if (selectedNodeIds.length === 1) {
        const selectedNode = graphManager.getNodeById(selectedNodeIds[0]);
        setSelectedNode(selectedNode);
      } else [setSelectedNode(null)];
    },

    onClickCanvas(event, position, graphManager) {
      // create node at click position
      const node = graphManager.createNode({
        position,
        inputPorts: [
          { id: generateUuid(), data: { position: "N" } },
          { id: generateUuid(), data: { position: "E" } },
          { id: generateUuid(), data: { position: "S" } },
          { id: generateUuid(), data: { position: "W" } },
        ],
        outputPorts: [
          { id: generateUuid(), data: { position: "N" } },
          { id: generateUuid(), data: { position: "E" } },
          { id: generateUuid(), data: { position: "S" } },
          { id: generateUuid(), data: { position: "W" } },
        ],
      });

      // select the newly created node
      graphManager.selectedNodeIds = [node.id];
    },
    onClickPort(event, port, parentNode, graphManager) {
      // create a connected node...
    },
    onKeyPress(event, key, graphManager) {
      if (
        key === "Backspace" &&
        graphManager.selectedNodeIds.length > 0 &&
        !isFormElementActive(document.activeElement)
      ) {
        // delete selected nodes
        graphManager.removeNodesByIds(graphManager.selectedNodeIds);
      }
    },
    onMutateGraph(graphEvent) {
      setGraphState(graphEvent.graph);
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

  return (
    <div className={styles.App}>
      <RecoilRoot>
        <GraphManagerContextProvider value={graphManager}>
          <NetworkCanvas
            theme={theme}
            {...callbacks}
            options={options}
            nodes={initialGraph.nodes}
            edges={initialGraph.edges}
          />
          <Inspector selectedNode={selectedNode} />
        </GraphManagerContextProvider>
      </RecoilRoot>
    </div>
  );
};

export { App };

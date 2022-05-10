import { useState, useMemo, useEffect } from "react";
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

  const callbacks = useMemo(
    () => ({
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
          position: {
            x: position.x - 120,
            y: position.y - 40,
          },
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
        const parentNodeElement = document.querySelector(
          `#Node-${parentNode.id}`
        );
        const edgesOut = graphManager
          .getEdgesByNodeId(parentNode.id)
          .filter(({ from }) => from.nodeId === parentNode.id);

        const BCR = parentNodeElement.getBoundingClientRect();
        const nodeDimensions =
          graphManager.workspace.getElementDimensions(parentNodeElement);
        const initialPosition = graphManager.workspace.getCanvasPosition(BCR);

        const portIndex = parentNode.outputPorts.indexOf(port);
        const outputPosition = ["N", "E", "S", "W"][portIndex];
        const inputIndex = [2, 3, 0, 1][portIndex];

        const position = {
          x: initialPosition.x,
          y: initialPosition.y,
        };

        switch (outputPosition) {
          case "N":
            position.y -= 60;
            break;
          case "E":
            position.x += nodeDimensions.width;
            break;
          case "S":
            position.y += 60;
            break;
          case "W":
            position.x -= nodeDimensions.width;
            break;
          default:
            break;
        }

        // const position = edgesOut.reduce(
        //   (acc, edge) => {
        //     const nodeElement = document.querySelector(
        //       `#Node-${edge.to.nodeId}`
        //     );
        //     const BCR = nodeElement.getBoundingClientRect();
        //     const nodeDimensions =
        //       graphManager.workspace.getElementDimensions(nodeElement);
        //     const position = graphManager.workspace.getCanvasPosition(BCR);

        //     if (position.y >= acc.y) {
        //       return {
        //         ...acc,
        //         y: position.y + nodeDimensions.height,
        //       };
        //     }
        //     return acc;
        //   },
        //   {
        //     x: initialPosition.x + nodeDimensions.width + 50,
        //     y: initialPosition.y,
        //   }
        // );

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

        graphManager.createEdge({
          from: {
            nodeId: parentNode.id,
            portId: port.id,
          },
          to: {
            nodeId: node.id,
            portId: node.inputPorts[inputIndex].id,
          },
        });

        graphManager.selectedNodeIds = [node.id];
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
    }),
    []
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "s" && e.metaKey) {
        console.log("save");
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

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
    <GraphManagerContextProvider value={graphManager}>
      <div className={styles.App}>
        <div className={styles.TitleBar}>
          <div className={styles.TitleBarControls}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <span>Domain model tools</span>
        </div>
        <div className={styles.Canvas}>
          <NetworkCanvas
            theme={theme}
            {...callbacks}
            options={options}
            nodes={initialGraph.nodes}
            edges={initialGraph.edges}
          />
          <Inspector selectedNode={selectedNode} />
        </div>
      </div>
    </GraphManagerContextProvider>
  );
};

export { App };

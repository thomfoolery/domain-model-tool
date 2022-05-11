import { useState, useMemo, useEffect } from "react";
import { v1 as generateUuid } from "uuid";
import { NetworkCanvas } from "react-network-canvas";

import { isFormElementActive } from "@/utils";
import { Node, Port, Inspector, FileMenu, SettingsMenu } from "@/components";
import { GraphManagerContextProvider } from "@/context";
import { initialGraph, setGraphState } from "@/state";

import styles from "./styles.module.css";
import { theme } from "./theme";

function Marker(props: { id: string; color: string }) {
  return (
    <marker
      refX="10"
      refY="10"
      id={props.id}
      orient="auto"
      markerWidth="3"
      markerHeight="3"
      viewBox="0 0 20 20"
      markerUnits="strokeWidth"
    >
      <circle cx="10" cy="10" r="10" fill={props.color} />
    </marker>
  );
}

const App = () => {
  const [graphManager, setGraphManager] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState<boolean>(false);

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
            position.y -= 80;
            break;
          case "E":
            position.x += nodeDimensions.width;
            break;
          case "S":
            position.y += nodeDimensions.height;
            break;
          case "W":
            position.x -= nodeDimensions.width;
            break;
          default:
            break;
        }

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
    edgeMarkerEnd: "url(#edge-marker)",
    edgeMarkerStart: "url(#edge-marker)",
    SvgEdgeMarkersDefs: (
      <>
        <defs>
          <Marker id="edge-marker-start" color="lightgray" />
          <Marker id="edge-marker-start-hover" color="#ff00dd" />
          <Marker id="edge-marker-start-draft" color="lightgray" />
          <Marker id="edge-marker-end" color="lightgray" />
          <Marker id="edge-marker-end-hover" color="#ff00dd" />
          <Marker id="edge-marker-end-draft" color="lightgray" />
        </defs>
      </>
    ),
  };

  const handleClickFileMenu = () => {
    setIsFileMenuOpen((isOpen: boolean) => !isOpen);
    setIsSettingsMenuOpen(false);
  };

  const handleClickSettingsMenu = () => {
    setIsSettingsMenuOpen((isOpen: boolean) => !isOpen);
    setIsFileMenuOpen(false);
  };

  const handleCloseMenus = () => {
    setIsSettingsMenuOpen(false);
    setIsFileMenuOpen(false);
  };

  return (
    <GraphManagerContextProvider value={graphManager}>
      <div className={styles.App}>
        <div className={styles.TitleBar}>
          <div className={styles.TitleBarControls}>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className={styles.TitleBarTitle}>Domain model tools</div>
          <menu>
            <button onClick={handleClickFileMenu}>
              File
              <FileMenu isOpen={isFileMenuOpen} closeMenu={handleCloseMenus} />
            </button>
            <button onClick={handleClickSettingsMenu}>Settings</button>
          </menu>
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
          <SettingsMenu
            isOpen={isSettingsMenuOpen}
            closeMenu={handleCloseMenus}
          />
        </div>
      </div>
    </GraphManagerContextProvider>
  );
};

export { App };

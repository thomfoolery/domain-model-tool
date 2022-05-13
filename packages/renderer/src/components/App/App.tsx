import { useState, useCallback } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { NetworkCanvas } from "react-network-canvas";
import { getRecoil } from "recoil-nexus";
import { v1 as generateUuid } from "uuid";

import { Node, Port, Inspector, FileMenu, SettingsMenu } from "@/components";
import { useRestorePersistedData } from "@/hooks";
import { isFormElementActive } from "@/utils";

import { removeNodeData } from "@/state";
import {
  graphManagerState,
  graphDataState,
  appFilePathState,
} from "@/state/atoms";

import styles from "./styles.module.css";
import { theme } from "./theme";

const OPTIONS = {
  gridSize: 20,
  maxZoom: 1.5,
  minZoom: 0.25,
  canvasSize: 5000,
  zoomWheelKey: "Shift",
  selectBoxKey: "Shift",
  isSnapToGridEnabled: true,
  NodeComponent: Node,
  PortComponent: Port,
  SvgEdgeMarkersDefs: (
    <defs>
      <Marker id="edge-marker-start" color="lightgray" />
      <Marker id="edge-marker-start-hover" color="#ff00dd" />
      <Marker id="edge-marker-start-draft" color="lightgray" />
      <Marker id="edge-marker-end" color="lightgray" />
      <Marker id="edge-marker-end-hover" color="#ff00dd" />
      <Marker id="edge-marker-end-draft" color="lightgray" />
    </defs>
  ),
};

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
  const setGraphData = useSetRecoilState(graphDataState);
  const setGraphManager = useSetRecoilState(graphManagerState);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState<boolean>(false);

  const appFilePath = useRecoilValue(appFilePathState);

  useRestorePersistedData();

  const onMount = useCallback(
    (graphManager: any) => {
      setGraphManager(graphManager);
      graphManager.import(getRecoil(graphDataState));
    },
    [setGraphManager]
  );

  const onMutateGraph = useCallback(
    (event: any, graphManager: any) => {
      if (event.action === "DELETE_NODE") {
        removeNodeData(event.subject.id);
      }
      setGraphData({ ...graphManager.export() });
    },
    [appFilePath]
  );

  const onKeyPress = useCallback((event, key, graphManager) => {
    if (
      key === "Backspace" &&
      graphManager.selectedNodeIds.length > 0 &&
      !isFormElementActive(document.activeElement)
    ) {
      // delete selected nodes
      graphManager.removeNodesByIds(graphManager.selectedNodeIds);
    }
  }, []);

  const onChangeSelectedNodeIds = useCallback((selectedNodeIds: string[]) => {
    if (selectedNodeIds.length === 1) {
      setSelectedNodeId(selectedNodeIds[0]);
    } else {
      setSelectedNodeId(null);
    }
  }, []);

  const onClickCanvas = useCallback((event, position, graphManager) => {
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
  }, []);

  const onClickPort = useCallback((event, port, parentNode, graphManager) => {
    const parentNodeElement = document.querySelector(`#Node-${parentNode.id}`);

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
  }, []);

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
    <div className={styles.App}>
      <div className={styles.TitleBar}>
        <div className={styles.TitleBarControls}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={styles.TitleBarTitle}>Schematix</div>

        <div className={styles.TitleBarFilePath}>
          {appFilePath && (
            <>
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M6 11h8v-2h-8v2zm0 4h8v-2h-8v2zm0-8h4v-2h-4v2zm6-5h-6.5a1.5 1.5 0 0 0-1.5 1.5v13a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5v-10.5l-4-4z"
                />
              </svg>
              {appFilePath}
            </>
          )}
        </div>

        <menu>
          <div>
            <button onClick={handleClickFileMenu}>File</button>
            <FileMenu isOpen={isFileMenuOpen} closeMenu={handleCloseMenus} />
          </div>
          <div>
            <button onClick={handleClickSettingsMenu}>Settings</button>
          </div>
        </menu>
      </div>
      <div className={styles.Canvas}>
        <NetworkCanvas
          theme={theme}
          options={OPTIONS}
          // initialGraph={initialGraph}
          onMount={onMount}
          onKeyPress={onKeyPress}
          onClickPort={onClickPort}
          onMutateGraph={onMutateGraph}
          onClickCanvas={onClickCanvas}
          onChangeSelectedNodeIds={onChangeSelectedNodeIds}
        />
        <Inspector selectedNodeId={selectedNodeId} />
        <SettingsMenu
          isOpen={isSettingsMenuOpen}
          closeMenu={handleCloseMenus}
        />
      </div>
    </div>
  );
};

export { App };

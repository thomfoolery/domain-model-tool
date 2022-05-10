import { useState } from "react";

import { useNodeState } from "@/hooks";
import { useGraphManager } from "@/context";

import styles from "./styles.module.css";

function Node(props: any) {
  const {
    node,
    position,
    isSelected,
    inputPorts,
    outputPorts,
    onMouseUp,
    onMouseDown,
    PortComponent,
  } = props;

  const style = {
    left: position.x,
    top: position.y,
  };

  const graphManager = useGraphManager();
  const [labelValue] = useNodeState(node.id, "label");

  const [isDraggingPort, setIsDraggingPort] = useState(false);

  const onMouseEnter = () => {
    if (graphManager?.dragData?.source === "port") {
      setIsDraggingPort(true);
    }
  };
  const onMouseLeave = () => {
    setIsDraggingPort(false);
  };

  const containerClassList = [styles.Node];

  if (isDraggingPort) {
    containerClassList.push(styles.isDraggingPort);
  } else {
    containerClassList.push(styles.isNotDraggingPort);
  }

  if (isSelected) {
    containerClassList.push(styles.isSelected);
  }

  return (
    <div
      style={style}
      id={`Node-${node.id}`}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={containerClassList.join(" ")}
    >
      <div className={styles.NodeInputPorts}>
        {inputPorts.map((port, index) => (
          <PortComponent
            key={port.id}
            node={node}
            port={port}
            type="input"
            index={index}
          />
        ))}
      </div>
      <div className={styles.NodeOutputPorts}>
        {outputPorts.map((port, index) => (
          <PortComponent
            key={port.id}
            node={node}
            port={port}
            type="output"
            index={index}
          />
        ))}
      </div>
      <div className={styles.NodeContent}>
        <div className={styles.NodeContentLabel}>{labelValue}</div>
      </div>
    </div>
  );
}

export { Node };

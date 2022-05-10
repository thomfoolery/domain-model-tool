import styles from "./styles.module.css";

interface Props {
  node: any;
  port: any;
  type: "input" | "output";
  onMouseUp(): void;
  onMouseDown(): void;
  index: number;
}

const DIRECTION = ["N", "E", "S", "W"];

function Port(props: Props) {
  const { port, type, onMouseUp, onMouseDown, index = 0 } = props;

  const classList = [
    styles.Port,
    styles[`Position${DIRECTION[index]}`],
    type === "input" ? styles.Input : styles.Output,
  ];

  return (
    <div className={classList.join(" ")}>
      {type === "input" && (
        <div
          id={`Port-${port.id}`}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          className={styles.PortTarget}
        />
      )}
      {port.label && <div className={styles.PortLabel}>{port.label}</div>}
      {type === "output" && (
        <div
          id={`Port-${port.id}`}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          className={styles.PortTarget}
        />
      )}
    </div>
  );
}

export { Port };

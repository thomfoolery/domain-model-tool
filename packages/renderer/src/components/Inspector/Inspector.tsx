import { useNodeState } from "@/hooks";

import styles from "./styles.module.css";

interface Props {
  selectedNode: any;
}

function Inspector(props: Props) {
  const { selectedNode } = props;

  const containerStyles = [styles.InspectorContainer];
  if (selectedNode) {
    containerStyles.push(styles.isOpen);
  }

  return (
    <div className={containerStyles.join(" ")}>
      <div className={styles.Inspector}>
        {selectedNode && <InspectorForm selectedNode={selectedNode} />}
      </div>
    </div>
  );
}

function InspectorForm(props: Props) {
  const { selectedNode } = props;

  const [labelValue, setLabelValue] = useNodeState(selectedNode.id, "label");
  const [descriptionValue, setDescriptionValue] = useNodeState(
    selectedNode.id,
    "description"
  );

  const onChangeLabelValue = (e: any) => {
    setLabelValue(e.target.value);
  };

  const onChangeDescriptionValue = (e: any) => {
    setDescriptionValue(e.target.value);
  };

  return (
    <div className={styles.InspectorForm}>
      <label htmlFor={`${selectedNode.id}-label`}>Label</label>
      <input
        type="text"
        value={labelValue}
        autoFocus={labelValue === ""}
        onChange={onChangeLabelValue}
        id={`${selectedNode.id}-label`}
      />

      <label htmlFor={`${selectedNode.id}-description`}>Description</label>
      <textarea
        value={descriptionValue}
        onChange={onChangeDescriptionValue}
        id={`${selectedNode.id}-description`}
        rows={5}
      />
    </div>
  );
}

export { Inspector };

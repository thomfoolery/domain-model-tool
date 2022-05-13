import { useRecoilValue } from "recoil";

import { useNodeState } from "@/hooks";
import { graphManagerState } from "@/state/atoms";

import styles from "./styles.module.css";

interface Props {
  selectedNodeId: string | null;
}

function Inspector(props: Props) {
  const { selectedNodeId } = props;

  const containerStyles = [styles.InspectorContainer];
  if (selectedNodeId) {
    containerStyles.push(styles.isOpen);
  }

  return (
    <div className={containerStyles.join(" ")}>
      <div className={styles.Inspector}>
        {selectedNodeId && <InspectorForm selectedNodeId={selectedNodeId} />}
      </div>
    </div>
  );
}
interface InspectorFormProps {
  selectedNodeId: string;
}

function InspectorForm(props: InspectorFormProps) {
  const { selectedNodeId } = props;

  const graphManager = useRecoilValue(graphManagerState);
  const [labelValue, setLabelValue] = useNodeState(selectedNodeId, "label");
  const [descriptionValue, setDescriptionValue] = useNodeState(
    selectedNodeId,
    "description"
  );

  const onChangeLabelValue = (e: any) => {
    setLabelValue(e.target.value);
  };

  const onChangeDescriptionValue = (e: any) => {
    setDescriptionValue(e.target.value);
  };

  const handleClickDelete = () => {
    graphManager.removeNodeById(selectedNodeId);
    // TODO cleanup node data & atoms
  };

  return (
    <div className={styles.InspectorForm}>
      <label htmlFor={`${selectedNodeId}-label`}>Label</label>
      <input
        type="text"
        value={labelValue}
        autoFocus={labelValue === ""}
        onChange={onChangeLabelValue}
        id={`${selectedNodeId}-label`}
      />

      <label htmlFor={`${selectedNodeId}-description`}>Description</label>
      <textarea
        value={descriptionValue}
        onChange={onChangeDescriptionValue}
        id={`${selectedNodeId}-description`}
        rows={5}
      />
      <div className={styles.InspectorformActions}>
        <button onClick={handleClickDelete}>Delete</button>
      </div>
    </div>
  );
}

export { Inspector };

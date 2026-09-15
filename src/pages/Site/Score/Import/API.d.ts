declare namespace APISiteScoreOfImport {
  type Props = {
    visible?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Loading = {
    importing?: boolean;
  };
}

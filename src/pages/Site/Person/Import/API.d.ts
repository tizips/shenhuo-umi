declare namespace APISitePersonOfImport {
  type Props = {
    visible?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Loading = {
    template?: boolean;
    importing?: boolean;
  };
}

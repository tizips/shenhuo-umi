declare namespace APISitePageBuiltin {
  type Props = {
    visible?: boolean;
    params?: APISitePageBuiltins.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    key?: string;
    page_id?: string;
  };

  type Loading = {
    confirmed?: boolean;
    pages?: boolean;
  };
}

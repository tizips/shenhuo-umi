declare namespace APISiteDraw {
  type Props = {
    visible?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    category_id?: number;
  };

  type Loading = {
    confirmed?: boolean;
    categories?: boolean;
  };
}

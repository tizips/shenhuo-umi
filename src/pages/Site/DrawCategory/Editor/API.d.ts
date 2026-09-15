declare namespace APISiteDrawCategory {
  type Props = {
    visible?: boolean;
    params?: APISiteDrawCategories.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    name?: string;
    icons?: any[];
    quota?: number;
    order?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}

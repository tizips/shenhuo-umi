declare namespace APISiteScheduleCategory {
  type Props = {
    visible?: boolean;
    params?: APISiteScheduleCategories.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    name?: string;
    order?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}

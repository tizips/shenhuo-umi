declare namespace APISiteSchedule {
  type Props = {
    visible?: boolean;
    params?: APISiteSchedules.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    category_id?: number;
    title?: string;
    subtitle?: string;
    description?: string;
    time?: string;
    items?: APISiteSchedules.Item[];
    order?: number;
  };

  type Loading = {
    confirmed?: boolean;
    categories?: boolean;
  };
}

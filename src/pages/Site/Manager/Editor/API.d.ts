declare namespace APISiteManager {
  type Props = {
    visible?: boolean;
    params?: APISiteManagers.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    name?: string;
    mobile?: string;
    password?: string;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}

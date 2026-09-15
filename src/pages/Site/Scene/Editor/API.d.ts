declare namespace APISiteScene {
  type Props = {
    visible?: boolean;
    params?: APISiteScenes.Data;
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

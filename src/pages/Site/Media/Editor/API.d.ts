declare namespace APISiteMedia {
  type Props = {
    visible?: boolean;
    params?: APISiteMedias.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    title?: string;
    scene_id?: number;
    type?: string;
    files?: any[];
    is_top?: number;
  };

  type Loading = {
    confirmed?: boolean;
    scenes?: boolean;
  };
}

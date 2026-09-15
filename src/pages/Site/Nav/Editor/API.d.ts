declare namespace APISiteNav {
  type Props = {
    visible?: boolean;
    params?: APISiteNavs.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    title?: string;
    icons?: any[];
    type?: string;
    value?: string;
    order?: number;
  };

  type Loading = {
    confirmed?: boolean;
    pages?: boolean;
  };
}

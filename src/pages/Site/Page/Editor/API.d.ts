declare namespace APISitePage {
  type Props = {
    visible?: boolean;
    params?: APISitePages.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    title?: string;
    content?: string;
  };

  type Loading = {
    confirmed?: boolean;
    init?: boolean;
  };
}

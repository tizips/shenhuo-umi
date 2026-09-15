declare namespace APISiteBanner {
  type Props = {
    visible?: boolean;
    params?: APISiteBanners.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    title?: string;
    images?: any[];
    link?: string;
    order?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}

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
    range?: any[];
  };

  type Create = {
    title?: string;
    image?: string;
    link?: string;
    order?: number;
    started_at?: string;
    ended_at?: string;
  };

  type Update = {
    id?: number;
    title?: string;
    image?: string;
    link?: string;
    order?: number;
    started_at?: string;
    ended_at?: string;
  };

  type Loading = {
    confirmed?: boolean;
  };
}

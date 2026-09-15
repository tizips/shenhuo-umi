declare namespace APISiteArticle {
  type Props = {
    visible?: boolean;
    params?: APISiteArticles.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    title?: string;
    thumbs?: any[];
    published_at?: any;
    is_top?: number;
    is_recommend?: number;
    content?: string;
  };

  type Loading = {
    confirmed?: boolean;
    init?: boolean;
  };
}

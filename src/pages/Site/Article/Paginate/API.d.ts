declare namespace APISiteArticles {
  type Data = {
    id?: number;
    title?: string;
    thumb?: string;
    published_at?: string;
    is_top?: number;
    is_recommend?: number;
    is_enable?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
    keyword?: string;
  };
}

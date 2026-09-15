declare namespace APISiteArticles {
  type Data = {
    id?: number;
    title?: string;
    thumb?: string;
    published_at?: string;
    is_top?: number;
    is_recommend?: number;
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
    keyword?: string;
  };
}

declare namespace APISitePageBuiltins {
  type Data = {
    id?: number;
    key?: string;
    page_id?: number;
    page_title?: string;
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

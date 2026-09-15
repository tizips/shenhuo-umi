declare namespace APISitePages {
  type Data = {
    id?: number;
    title?: string;
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

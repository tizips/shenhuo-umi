declare namespace APISiteManagers {
  type Data = {
    id?: string;
    name?: string;
    mobile?: string;
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

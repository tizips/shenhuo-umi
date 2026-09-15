declare namespace APISiteNavs {
  type Data = {
    id?: number;
    title?: string;
    icon?: string;
    type?: string;
    value?: string;
    page_name?: string;
    order?: number;
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
  };
}

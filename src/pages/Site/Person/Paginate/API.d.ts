declare namespace APISitePersons {
  type Data = {
    id?: string;
    name?: string;
    unit?: string;
    mobile?: string;
    number?: string;
    group_name?: string;
    must_change_password?: number;
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    editor?: boolean;
    import?: boolean;
  };

  type Search = {
    page?: number;
    keyword?: string;
  };
}

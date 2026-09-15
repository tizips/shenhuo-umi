declare namespace APISiteBanners {
  type Data = {
    id?: number;
    title?: string;
    image?: string;
    link?: string;
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

declare namespace APISiteMedias {
  type Data = {
    id?: number;
    title?: string;
    scene_id?: number;
    scene?: string;
    type?: string;
    url?: string;
    is_top?: number;
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
    size?: number;
    scene_id?: number;
    type?: string;
  };
}

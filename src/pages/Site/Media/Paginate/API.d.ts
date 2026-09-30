declare namespace APISiteMedias {
  type Data = {
    id?: number;
    title?: string;
    scene_id?: number;
    scene?: string;
    type?: 'image' | 'video';
    url?: string;
    cover?: string;
    is_top?: number;
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
    size?: number;
    scene_id?: number;
    type?: string;
  };
}

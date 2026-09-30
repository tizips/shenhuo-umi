declare namespace APISiteMedia {
  type Props = {
    visible?: boolean;
    params?: APISiteMedias.Data;
    defaultType?: 'image' | 'video';
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type CreateImage = {
    scene_id: number;
    is_top: number;
    is_enable: number;
    urls: string[];
  };

  type CreateVideo = {
    scene_id: number;
    is_top: number;
    is_enable: number;
    title: string;
    url: string;
    cover: string;
  };

  type Update = {
    id: number;
    scene_id: number;
    is_top: number;
    is_enable: number;
    type: 'image' | 'video';
    title?: string;
    url: string;
    cover?: string;
  };

  type Former = {
    title?: string;
    scene_id?: number;
    type?: 'image' | 'video';
    files?: any[];
    covers?: any[];
    is_top?: number;
    is_enable?: number;
  };

  type Loading = {
    init?: boolean;
    confirmed?: boolean;
    scenes?: boolean;
  };
}

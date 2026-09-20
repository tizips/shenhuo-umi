declare namespace APISiteScores {
  type Data = {
    id?: number;
    person_id?: string;
    name?: string;
    number?: string;
    unit?: string;
    group_name?: string;
    total?: string;
    order?: number;
    created_at?: string;
    loading_deleted?: boolean;
  } & APISite.ScoreItems;

  type Visible = {
    editor?: boolean;
    import?: boolean;
    notify?: boolean;
  };

  type Notify = {
    /** 抽签分组（draw-category）ID */
    category_id: number;
  };

  type NotifyResult = {
    /** 抽签分组名称 */
    group?: string;
    /** 分组下成绩总数 */
    total?: number;
    /** 推送成功数 */
    sent?: number;
    /** 推送失败数 */
    failed?: number;
    /** 跳过数；未绑定微信的人员 */
    skipped?: number;
  };

  type NotifyProps = {
    visible?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type NotifyLoading = {
    categories?: boolean;
  };

  type Search = {
    page?: number;
    size?: number;
    keyword?: string;
  };
}

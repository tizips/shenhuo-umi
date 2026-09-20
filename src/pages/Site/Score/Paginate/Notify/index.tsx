import React, { useEffect, useState } from 'react';
import { Modal, notification, Spin, Button, Space, Divider } from 'antd';
import { doSiteDrawCategoryOfOpening } from '@/services/site';
import { doNotify } from '../service';
import Constants from '@/utils/Constants';

const Notify: React.FC<APISiteScores.NotifyProps> = (props) => {
  const [loading, setLoading] = useState<APISiteScores.NotifyLoading>({});
  const [categories, setCategories] = useState<APISite.Opening[]>([]);

  const toCategories = () => {
    setLoading({ ...loading, categories: true });
    doSiteDrawCategoryOfOpening()
      .then((response) => {
        if (response.code === Constants.Success) {
          setCategories(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, categories: false }));
  };

  const onNotify = (category: APISite.Opening) => {
    Modal.confirm({
      title: '推送成绩通知',
      content: `确定要向「${category.name}」分组的参赛人员推送成绩通知吗？`,
      okText: '推送',
      cancelText: '取消',
      onOk: () =>
        doNotify({ category_id: category.id as number }).then((response) => {
          if (response.code !== Constants.Success) {
            notification.error({ message: response.message });
            return Promise.reject();
          }
          const { group, total, sent, failed, skipped } = response.data ?? {};
          notification[(failed ?? 0) > 0 || (sent ?? 0) === 0 ? 'warning' : 'success']({
            message: `「${group ?? category.name}」成绩推送完成`,
            description: `共 ${total ?? 0} 人，成功 ${sent ?? 0} 人，失败 ${
              failed ?? 0
            } 人，跳过 ${skipped ?? 0} 人（未绑定微信）`,
          });
          props.onSave?.();
        }),
    });
  };

  useEffect(() => {
    if (props.visible) {
      setCategories([]);
      toCategories();
    }
  }, [props.visible]);

  return (
    <Modal
      title="推送成绩通知"
      open={props.visible}
      footer={null}
      onCancel={props.onCancel}
      width={520}
    >
      <Divider />
      <Spin spinning={!!loading.categories}>
        <Space direction="vertical" style={{ width: '100%' }} size={10}>
          {categories.map((item) => (
            <Button key={item.id} type="primary" block onClick={() => onNotify(item)}>
              {item.name}
            </Button>
          ))}
        </Space>
      </Spin>
    </Modal>
  );
};

export default Notify;

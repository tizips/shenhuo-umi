import React, { useEffect, useState } from 'react';
import { Form, Modal, notification, Select } from 'antd';
import { doSiteDrawCategoryOfOpening } from '@/services/site';
import { doCreate } from './service';
import Constants from '@/utils/Constants';

const Editor: React.FC<APISiteDraw.Props> = (props) => {
  const [former] = Form.useForm<APISiteDraw.Former>();
  const [loading, setLoading] = useState<APISiteDraw.Loading>({});
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

  const onSubmit = (values: APISiteDraw.Former) => {
    setLoading({ ...loading, confirmed: true });
    doCreate(values)
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          const names = (response.data || []).map((item) => item.name).join('、');
          notification.success({
            message: names ? `抽签成功：${names}` : '抽签成功',
          });
          props.onSave?.();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  useEffect(() => {
    if (props.visible) {
      former.setFieldsValue({ category_id: undefined });
      toCategories();
    }
  }, [props.visible]);

  return (
    <Modal
      title="抽签"
      open={props.visible}
      onOk={former.submit}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
      okText="开始抽签"
    >
      <Form form={former} onFinish={onSubmit} labelCol={{ span: 5 }}>
        <Form.Item label="抽签类别" name="category_id" rules={[{ required: true }]}>
          <Select
            loading={loading.categories}
            options={categories.map((item) => ({ label: item.name, value: item.id }))}
            placeholder="将抽满该类别剩余名额"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;

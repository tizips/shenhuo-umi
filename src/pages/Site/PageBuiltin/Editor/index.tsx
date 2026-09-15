import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Modal, notification, Select } from 'antd';
import { doSitePageOfOpening } from '@/services/site';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';

const Editor: React.FC<APISitePageBuiltin.Props> = (props) => {
  const [former] = Form.useForm<APISitePageBuiltin.Former>();
  const [loading, setLoading] = useState<APISitePageBuiltin.Loading>({});
  const [pages, setPages] = useState<APISite.Opening[]>([]);

  const toPages = () => {
    setLoading({ ...loading, pages: true });
    doSitePageOfOpening()
      .then((response) => {
        if (response.code === Constants.Success) {
          setPages(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, pages: false }));
  };

  const submit = (values: APISitePageBuiltin.Former, isUpdate: boolean) => {
    const params = {
      key: values.key,
      page_id: Number(values.page_id),
    };
    setLoading({ ...loading, confirmed: true });

    const req = isUpdate ? doUpdate(props.params?.id, params) : doCreate(params);
    req
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: isUpdate ? '修改成功' : '添加成功' });
          props.onSave?.();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  useEffect(() => {
    if (props.visible) {
      former.setFieldsValue({
        key: props.params?.key,
        page_id: props.params?.page_id ? String(props.params.page_id) : undefined,
      });
      if (pages.length <= 0) {
        toPages();
      }
    }
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '编辑' : '创建'}
      open={props.visible}
      onOk={former.submit}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Divider />
      <Form
        form={former}
        onFinish={(values) => submit(values, !!props.params)}
        labelCol={{ span: 4 }}
      >
        <Form.Item
          label="标识"
          name="key"
          rules={[{ required: true }, { max: 64 }]}
          extra="内置页面标识，全局唯一"
        >
          <Input placeholder="如：home_about" />
        </Form.Item>
        <Form.Item label="关联页面" name="page_id" rules={[{ required: true }]}>
          <Select
            loading={loading.pages}
            showSearch
            optionFilterProp="label"
            options={pages.map((item) => ({ label: item.name, value: String(item.id) }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;

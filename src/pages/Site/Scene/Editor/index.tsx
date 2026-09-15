import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, InputNumber, Modal, notification } from 'antd';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';

const Editor: React.FC<APISiteScene.Props> = (props) => {
  const [former] = Form.useForm<APISiteScene.Former>();
  const [loading, setLoading] = useState<APISiteScene.Loading>({});

  const toCreate = (params: APISiteScene.Former) => {
    setLoading({ confirmed: true });
    doCreate(params)
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '添加成功' });
          props.onSave?.();
          props.onCreate?.();
        }
      })
      .finally(() => setLoading({ confirmed: false }));
  };

  const toUpdate = (params: APISiteScene.Former) => {
    setLoading({ confirmed: true });
    doUpdate(props.params?.id, params)
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '修改成功' });
          props.onSave?.();
          props.onUpdate?.();
        }
      })
      .finally(() => setLoading({ confirmed: false }));
  };

  const onSubmit = (values: APISiteScene.Former) => {
    if (props.params) {
      toUpdate(values);
    } else {
      toCreate(values);
    }
  };

  useEffect(() => {
    if (props.visible) {
      former.setFieldsValue({
        name: props.params?.name,
        order: props.params?.order ?? 50,
      });
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
      <Form form={former} onFinish={onSubmit} labelCol={{ span: 4 }}>
        <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 64 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="排序"
          name="order"
          rules={[{ required: true }, { type: 'number', min: 1, max: 99 }]}
          extra="数值越小越靠前，默认 50"
        >
          <InputNumber min={1} max={99} precision={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;

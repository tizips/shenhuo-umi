import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, notification, Spin } from 'antd';
import WangEditor from '@/components/Common/WangEditor';
import { doSitePageOfInformation } from '@/services/site';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';

const requiredHtml = [
  {
    required: true,
    validator(_: unknown, value?: string) {
      const text = (value || '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
      return text ? Promise.resolve() : Promise.reject(new Error('请输入内容'));
    },
  },
];

const Editor: React.FC<APISitePage.Props> = (props) => {
  const [former] = Form.useForm<APISitePage.Former>();
  const [loading, setLoading] = useState<APISitePage.Loading>({});

  const submit = (values: APISitePage.Former, isUpdate: boolean) => {
    setLoading({ ...loading, confirmed: true });
    const req = isUpdate ? doUpdate(props.params?.id, values) : doCreate(values);
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

  const toInit = () => {
    if (!props.params) {
      former.setFieldsValue({ title: undefined, content: undefined });
      return;
    }
    setLoading({ init: true });
    doSitePageOfInformation(props.params.id)
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
          props.onCancel?.();
        } else {
          former.setFieldsValue({
            title: response.data.title,
            content: response.data.content,
          });
        }
      })
      .finally(() => setLoading({ init: false }));
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
    }
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '编辑' : '创建'}
      open={props.visible}
      width={860}
      onOk={former.submit}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Spin spinning={!!loading.init}>
        <Form
          form={former}
          onFinish={(values) => submit(values, !!props.params)}
          labelCol={{ span: 3 }}
        >
          <Form.Item label="标题" name="title" rules={[{ required: true }, { max: 120 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="内容" name="content" rules={requiredHtml}>
            <WangEditor dir="/site/page" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;

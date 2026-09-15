import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, notification, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { doCreate, doUpdate } from './service';
import { createUploadRequest } from '@/services/helper';
import Constants from '@/utils/Constants';

const onUpload = (e: any) => {
  if (Array.isArray(e)) return e;
  if (e.file.status === 'done') {
    e.fileList?.forEach((item: any) => {
      if (item.uid === e.file.uid) {
        if (e.file.response?.code !== Constants.Success) {
          notification.error({ message: e.file.response?.message });
        } else {
          item.thumbUrl = e.file.response.data.url;
          item.url = e.file.response.data.url;
        }
      }
    });
  }
  return e.fileList;
};

const Editor: React.FC<APISiteDrawCategory.Props> = (props) => {
  const [former] = Form.useForm<APISiteDrawCategory.Former>();
  const [loading, setLoading] = useState<APISiteDrawCategory.Loading>({});
  const icons = Form.useWatch('icons', former);

  const submit = (values: APISiteDrawCategory.Former, isUpdate: boolean) => {
    const params = {
      name: values.name,
      icon:
        values.icons?.[0]?.response?.data?.url ||
        values.icons?.[0]?.thumbUrl ||
        values.icons?.[0]?.url,
      quota: values.quota,
      order: values.order ?? 50,
    };

    setLoading({ confirmed: true });
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
      .finally(() => setLoading({ confirmed: false }));
  };

  useEffect(() => {
    if (props.visible) {
      former.setFieldsValue({
        name: props.params?.name,
        icons: props.params?.icon
          ? [{ uid: String(props.params.id), thumbUrl: props.params.icon, status: 'done' }]
          : [],
        quota: props.params?.quota,
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
      <Form
        form={former}
        onFinish={(values) => submit(values, !!props.params)}
        labelCol={{ span: 5 }}
      >
        <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 64 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="图标"
          name="icons"
          valuePropName="fileList"
          getValueFromEvent={onUpload}
          rules={[{ required: true, message: '请上传图标' }]}
        >
          <Upload
            name="file"
            listType="picture-card"
            maxCount={1}
            action={Constants.Upload}
            customRequest={createUploadRequest('/site/draw-category')}
            data={{ dir: '/site/draw-category' }}
          >
            {icons && icons.length > 0 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="中签人数" name="quota" rules={[{ required: true }]}>
          <InputNumber min={1} precision={0} style={{ width: '100%' }} />
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

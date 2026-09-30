import React, { useEffect, useState } from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, notification, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
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

const Editor: React.FC<APISiteBanner.Props> = (props) => {
  const [former] = Form.useForm<APISiteBanner.Former>();
  const [loading, setLoading] = useState<APISiteBanner.Loading>({});
  const images = Form.useWatch('images', former);

  const submit = (values: APISiteBanner.Former, isUpdate: boolean) => {
    const [start, end] = values.range || [];
    const image =
      values.images?.[0]?.response?.data?.url ||
      values.images?.[0]?.thumbUrl ||
      values.images?.[0]?.url;

    if (!image) {
      notification.error({ message: '请上传图片' });
      return;
    }

    const params: APISiteBanner.Create = {
      title: values.title,
      image,
      link: values.link || '',
      order: values.order ?? 50,
      started_at: start ? dayjs(start).format('YYYY-MM-DD HH:mm:ss') : undefined,
      ended_at: end ? dayjs(end).format('YYYY-MM-DD HH:mm:ss') : undefined,
    };
    setLoading({ ...loading, confirmed: true });

    const req = isUpdate
      ? doUpdate(props.params?.id, { ...params, id: props.params?.id })
      : doCreate(params);
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
      if (props.params) {
        former.setFieldsValue({
          title: props.params.title,
          images: props.params.image
            ? [{ uid: String(props.params.id), thumbUrl: props.params.image, status: 'done' }]
            : [],
          link: props.params.link,
          order: props.params.order ?? 50,
          range:
            props.params.started_at && props.params.ended_at
              ? [dayjs(props.params.started_at), dayjs(props.params.ended_at)]
              : undefined,
        });
      } else {
        former.resetFields();
        former.setFieldsValue({
          order: 50,
        });
      }
    }
  }, [props.visible, props.params]);

  return (
    <Modal
      title={props.params ? '编辑' : '创建'}
      open={props.visible}
      width={600}
      onOk={former.submit}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form
        form={former}
        onFinish={(values) => submit(values, !!props.params)}
        labelCol={{ span: 5 }}
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }, { max: 64 }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item
          label="图片"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={onUpload}
          rules={[{ required: true, message: '请上传图片' }]}
        >
          <Upload
            name="file"
            listType="picture-card"
            maxCount={1}
            action={Constants.Upload}
            customRequest={createUploadRequest('/site/banner')}
            data={{ dir: '/site/banner' }}
          >
            {images && images.length > 0 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="跳转链接" name="link" rules={[{ max: 255 }]}>
          <Input placeholder="https://，可为空" />
        </Form.Item>
        <Form.Item
          label="生效时间"
          name="range"
          rules={[
            { required: true, message: '请选择生效时间' },
            {
              validator: (_, value) => {
                if (value && value[0] && value[1] && !value[1].isAfter(value[0])) {
                  return Promise.reject(new Error('结束时间需晚于开始时间'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker.RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['开始时间', '结束时间']}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="排序"
          name="order"
          rules={[{ required: true, message: '请输入排序' }, { type: 'number', min: 1, max: 99 }]}
          extra="数值越小越靠前，范围 1-99，默认 50"
        >
          <InputNumber min={1} max={99} precision={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;

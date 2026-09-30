import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, notification, Select, Spin, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { doSiteSceneOfOpening, doSiteMediaOfInformation } from '@/services/site';
import { doCreateImages, doCreateVideo, doUpdate } from './service';
import { createUploadRequest } from '@/services/helper';
import Constants from '@/utils/Constants';

const yesNo = [
  { label: '是', value: 1 },
  { label: '否', value: 2 },
];

const onUpload = (e: any) => {
  if (Array.isArray(e)) return e;
  if (e?.file?.status === 'done') {
    if (e.file.response?.code !== Constants.Success) {
      notification.error({ message: e.file.response?.message || '上传失败' });
    }
  }
  e?.fileList?.forEach((item: any) => {
    if (item.response?.code === Constants.Success && item.response?.data?.url) {
      item.url = item.response.data.url;
      item.thumbUrl = item.response.data.url;
    }
  });
  return e?.fileList;
};

const Editor: React.FC<APISiteMedia.Props> = (props) => {
  const [former] = Form.useForm<APISiteMedia.Former>();
  const [loading, setLoading] = useState<APISiteMedia.Loading>({});
  const [scenes, setScenes] = useState<APISite.Opening[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; isVideo: boolean }>({
    url: '',
    isVideo: false,
  });

  const type = Form.useWatch('type', former);
  const files = Form.useWatch('files', former);
  const covers = Form.useWatch('covers', former);
  const isUpdate = !!props.params;
  const maxFileCount = isUpdate || type === 'video' ? 1 : 20;

  const toScenes = () => {
    setLoading((prev) => ({ ...prev, scenes: true }));
    doSiteSceneOfOpening()
      .then((response) => {
        if (response.code === Constants.Success) {
          setScenes(response.data);
        }
      })
      .finally(() => setLoading((prev) => ({ ...prev, scenes: false })));
  };

  const submit = (values: APISiteMedia.Former) => {
    const isUploading =
      values.files?.some((item: any) => item.status === 'uploading') ||
      values.covers?.some((item: any) => item.status === 'uploading');
    if (isUploading) {
      notification.warning({ message: '文件正在上传中，请稍候' });
      return;
    }

    if (isUpdate) {
      if (!props.params?.id) return;
      if (values.type === 'video') {
        const cover =
          values.covers?.[0]?.url ||
          values.covers?.[0]?.thumbUrl ||
          values.covers?.[0]?.response?.data?.url;
        if (!cover) {
          notification.error({ message: '请上传视频封面' });
          return;
        }
        const url =
          values.files?.[0]?.url ||
          values.files?.[0]?.thumbUrl ||
          values.files?.[0]?.response?.data?.url;
        if (!url) {
          notification.error({ message: '请上传视频' });
          return;
        }
        if (!values.title?.trim()) {
          notification.error({ message: '请输入视频标题' });
          return;
        }
        const params: APISiteMedia.Update = {
          id: props.params.id,
          scene_id: values.scene_id!,
          is_top: values.is_top ?? 2,
          is_enable: values.is_enable ?? 1,
          type: 'video',
          title: values.title.trim(),
          url,
          cover,
        };
        setLoading((prev) => ({ ...prev, confirmed: true }));
        doUpdate(props.params.id, params)
          .then((response) => {
            if (response.code !== Constants.Success) {
              notification.error({ message: response.message });
            } else {
              notification.success({ message: '修改成功' });
              props.onSave?.();
              props.onUpdate?.();
            }
          })
          .finally(() => setLoading((prev) => ({ ...prev, confirmed: false })));
      } else {
        const url =
          values.files?.[0]?.url ||
          values.files?.[0]?.thumbUrl ||
          values.files?.[0]?.response?.data?.url;
        if (!url) {
          notification.error({ message: '请上传图片' });
          return;
        }
        const params: APISiteMedia.Update = {
          id: props.params.id,
          scene_id: values.scene_id!,
          is_top: values.is_top ?? 2,
          is_enable: values.is_enable ?? 1,
          type: 'image',
          url,
        };
        setLoading((prev) => ({ ...prev, confirmed: true }));
        doUpdate(props.params.id, params)
          .then((response) => {
            if (response.code !== Constants.Success) {
              notification.error({ message: response.message });
            } else {
              notification.success({ message: '修改成功' });
              props.onSave?.();
              props.onUpdate?.();
            }
          })
          .finally(() => setLoading((prev) => ({ ...prev, confirmed: false })));
      }
      return;
    }

    // Create mode
    if (values.type === 'video') {
      const cover =
        values.covers?.[0]?.url ||
        values.covers?.[0]?.thumbUrl ||
        values.covers?.[0]?.response?.data?.url;
      if (!cover) {
        notification.error({ message: '请上传视频封面' });
        return;
      }
      const url =
        values.files?.[0]?.url ||
        values.files?.[0]?.thumbUrl ||
        values.files?.[0]?.response?.data?.url;
      if (!url) {
        notification.error({ message: '请上传视频' });
        return;
      }
      if (!values.title?.trim()) {
        notification.error({ message: '请输入视频标题' });
        return;
      }
      const params: APISiteMedia.CreateVideo = {
        scene_id: values.scene_id!,
        is_top: values.is_top ?? 2,
        is_enable: values.is_enable ?? 1,
        title: values.title.trim(),
        url,
        cover,
      };
      setLoading((prev) => ({ ...prev, confirmed: true }));
      doCreateVideo(params)
        .then((response) => {
          if (response.code !== Constants.Success) {
            notification.error({ message: response.message });
          } else {
            notification.success({ message: '添加成功' });
            props.onSave?.();
            props.onCreate?.();
          }
        })
        .finally(() => setLoading((prev) => ({ ...prev, confirmed: false })));
    } else {
      // Image mode: batch add images
      const urls: string[] = (values.files || [])
        .map((item: any) => item.url || item.thumbUrl || item.response?.data?.url)
        .filter(Boolean);
      if (urls.length === 0) {
        notification.error({ message: '请上传图片' });
        return;
      }
      if (urls.length > 20) {
        notification.error({ message: '最多只能上传 20 张图片' });
        return;
      }
      const params: APISiteMedia.CreateImage = {
        scene_id: values.scene_id!,
        is_top: values.is_top ?? 2,
        is_enable: values.is_enable ?? 1,
        urls,
      };
      setLoading((prev) => ({ ...prev, confirmed: true }));
      doCreateImages(params)
        .then((response) => {
          if (response.code !== Constants.Success) {
            notification.error({ message: response.message });
          } else {
            notification.success({ message: '添加成功' });
            props.onSave?.();
            props.onCreate?.();
          }
        })
        .finally(() => setLoading((prev) => ({ ...prev, confirmed: false })));
    }
  };

  const handlePreview = async (file: any, isVideo: boolean = false) => {
    const url = file.url || file.thumbUrl || file.response?.data?.url;
    if (url) {
      setPreviewMedia({
        url,
        isVideo,
      });
      setPreviewOpen(true);
    }
  };

  useEffect(() => {
    if (props.visible) {
      if (scenes.length <= 0) {
        toScenes();
      }
      if (props.params?.id) {
        setLoading((prev) => ({ ...prev, init: true }));
        doSiteMediaOfInformation(props.params.id)
          .then((response) => {
            if (response.code !== Constants.Success) {
              notification.error({ message: response.message });
              props.onCancel?.();
            } else {
              const data = response.data;
              former.setFieldsValue({
                title: data.title,
                scene_id: data.scene_id,
                type: data.type,
                is_top: data.is_top ?? 2,
                is_enable: data.is_enable ?? 1,
                files: data.url
                  ? [
                      {
                        uid: '-1',
                        name: data.title || (data.type === 'video' ? '视频' : '图片'),
                        thumbUrl: data.url,
                        url: data.url,
                        status: 'done',
                      },
                    ]
                  : [],
                covers: data.cover
                  ? [
                      {
                        uid: '-2',
                        name: '封面',
                        thumbUrl: data.cover,
                        url: data.cover,
                        status: 'done',
                      },
                    ]
                  : [],
              });
            }
          })
          .finally(() => setLoading((prev) => ({ ...prev, init: false })));
      } else {
        former.resetFields();
        former.setFieldsValue({
          title: undefined,
          scene_id: undefined,
          type: props.defaultType || 'image',
          is_top: 2,
          is_enable: 1,
          files: [],
          covers: [],
        });
      }
    }
  }, [props.visible, props.params?.id, props.defaultType]);

  const modalTitle = isUpdate
    ? `编辑${type === 'video' ? '视频' : '图片'}`
    : type === 'video'
    ? '添加视频'
    : '批量添加图片';

  const uploadExtra =
    type === 'video'
      ? '请上传视频文件，支持常见视频格式'
      : isUpdate
      ? '请上传图片文件'
      : '支持批量上传，最多可上传 20 张图片';

  return (
    <>
      <Modal
        title={modalTitle}
        open={props.visible}
        onOk={former.submit}
        onCancel={props.onCancel}
        confirmLoading={loading.confirmed}
        destroyOnClose
      >
        <Spin spinning={!!loading.init}>
          <Form form={former} onFinish={submit} labelCol={{ span: 4 }}>
            <Form.Item
              label="场景"
              name="scene_id"
              rules={[{ required: true, message: '请选择所属场景' }]}
            >
              <Select
                loading={loading.scenes}
                placeholder="请选择所属场景"
                options={scenes.map((item) => ({ label: item.name, value: item.id }))}
              />
            </Form.Item>
            <Form.Item
              label="类型"
              name="type"
              rules={[{ required: true, message: '请选择媒体类型' }]}
            >
              <Select
                disabled={isUpdate}
                options={[
                  { label: '图片', value: 'image' },
                  { label: '视频', value: 'video' },
                ]}
                onChange={(val) => {
                  former.setFieldValue('files', []);
                  former.setFieldValue('covers', []);
                  if (val !== 'video') {
                    former.setFieldValue('title', undefined);
                  }
                }}
              />
            </Form.Item>
            {type === 'video' && (
              <Form.Item
                label="标题"
                name="title"
                rules={[
                  { required: true, message: '请输入视频标题' },
                  { max: 128, message: '标题最多 128 个字符' },
                ]}
              >
                <Input placeholder="请输入视频标题" maxLength={128} />
              </Form.Item>
            )}
            {type === 'video' && (
              <Form.Item
                label="封面"
                name="covers"
                valuePropName="fileList"
                getValueFromEvent={onUpload}
                extra="请上传视频封面图片"
                rules={[{ required: true, message: '请上传视频封面' }]}
              >
                <Upload
                  name="file"
                  listType="picture-card"
                  maxCount={1}
                  accept="image/*"
                  action={Constants.Upload}
                  customRequest={createUploadRequest('/site/media')}
                  data={{ dir: '/site/media' }}
                  onPreview={(file) => handlePreview(file, false)}
                >
                  {covers && covers.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>上传封面</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            )}
            <Form.Item
              label={type === 'video' ? '视频' : '图片'}
              name="files"
              valuePropName="fileList"
              getValueFromEvent={onUpload}
              extra={uploadExtra}
              rules={[{ required: true, message: type === 'video' ? '请上传视频' : '请上传图片' }]}
            >
              <Upload
                name="file"
                listType="picture-card"
                maxCount={maxFileCount}
                multiple={!isUpdate && type === 'image'}
                accept={type === 'video' ? 'video/*' : 'image/*'}
                action={Constants.Upload}
                customRequest={createUploadRequest('/site/media')}
                data={{ dir: '/site/media' }}
                onPreview={(file) => handlePreview(file, type === 'video')}
              >
                {files && files.length >= maxFileCount ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>
                      {type === 'video' ? '上传视频' : '上传图片'}
                    </div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              label="置顶"
              name="is_top"
              rules={[{ required: true }]}
              extra="置顶内容在小程序端优先展示"
            >
              <Select options={yesNo} />
            </Form.Item>
            <Form.Item label="启用" name="is_enable" rules={[{ required: true }]}>
              <Select options={yesNo} />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      <Modal
        open={previewOpen}
        title="预览"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        destroyOnClose
      >
        {previewMedia.isVideo ? (
          <video src={previewMedia.url} controls style={{ width: '100%' }} />
        ) : (
          <img alt="preview" style={{ width: '100%' }} src={previewMedia.url} />
        )}
      </Modal>
    </>
  );
};

export default Editor;

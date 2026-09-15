import React, { useEffect, useState } from 'react';
import { Alert, Divider, Modal, Upload, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { doImport } from './service';
import Constants from '@/utils/Constants';

const Import: React.FC<APISiteScoreOfImport.Props> = (props) => {
  const [file, setFile] = useState<UploadFile>();
  const [loading, setLoading] = useState<APISiteScoreOfImport.Loading>({});

  useEffect(() => {
    if (props.visible) setFile(undefined);
  }, [props.visible]);

  const onImport = () => {
    if (!file?.originFileObj) return;
    setLoading({ importing: true });
    doImport(file.originFileObj)
      .then((response) => {
        if (response.code !== Constants.Success) {
          message.error(response.message);
        } else {
          message.success(
            `导入完成：共 ${response.data.total} 条，新增 ${response.data.created}，更新 ${response.data.updated}，跳过 ${response.data.skipped}`,
          );
          props.onSave?.();
        }
      })
      .finally(() => setLoading({ importing: false }));
  };

  return (
    <Modal
      title="导入成绩"
      open={props.visible}
      onCancel={props.onCancel}
      confirmLoading={loading.importing}
      okText="开始导入"
      okButtonProps={{ disabled: !file }}
      onOk={onImport}
      width={480}
    >
      <Divider />
      <Upload.Dragger
        accept=".xls,.xlsx"
        multiple={false}
        maxCount={1}
        disabled={loading.importing}
        fileList={file ? [file] : []}
        beforeUpload={(file) => {
          setFile({ uid: file.uid, name: file.name, status: 'done', originFileObj: file });
          return false;
        }}
        onRemove={() => setFile(undefined)}
      >
        <p className="ant-upload-drag-icon">
          <CloudUploadOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
        <p className="ant-upload-hint">第一步上传 Excel 文件，确认后点击「开始导入」</p>
      </Upload.Dragger>
      <Alert
        type="info"
        showIcon
        message="导入说明"
        description={
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Excel 表头需包含：参赛号、理论成绩、管理能力、心肺复苏、自救器、紧急避险</li>
            <li>参赛号必填，其余成绩列可选填；总分与名次由系统自动计算</li>
            <li>仅支持 .xls / .xlsx 格式文件</li>
            <li>参赛号已存在的数据将被更新，无效数据将被跳过</li>
          </ul>
        }
        style={{ marginTop: 16 }}
      />
    </Modal>
  );
};

export default Import;

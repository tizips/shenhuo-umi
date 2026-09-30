import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Divider, Input, Modal, Space, Spin, Table, Tooltip } from 'antd';
import { doInformation, doPaginate } from './service';
import Constants from '@/utils/Constants';
import dayjs from 'dayjs';

const Paginate: React.FC = () => {
  const [search, setSearch] = useState<APISiteAppeals.Search>({});
  const [load, setLoad] = useState(false);
  const [data, setData] = useState<APIData.Paginate<APISiteAppeals.Data>>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoad, setDetailLoad] = useState(false);
  const [detail, setDetail] = useState<APISiteAppeals.Data | undefined>();

  const toPaginate = () => {
    setLoad(true);
    doPaginate(search)
      .then((response) => {
        if (response.code === Constants.Success) {
          setData(response.data);
        }
      })
      .finally(() => setLoad(false));
  };

  const onDetail = (record: APISiteAppeals.Data) => {
    setDetail(record);
    setDetailVisible(true);
    if (record.id) {
      setDetailLoad(true);
      doInformation(record.id)
        .then((response) => {
          if (response.code === Constants.Success && response.data) {
            setDetail(response.data);
          }
        })
        .finally(() => setDetailLoad(false));
    }
  };

  useEffect(() => {
    toPaginate();
  }, [search]);

  return (
    <>
      <Card
        title="仲裁申诉"
        extra={
          <Space size={[10, 10]}>
            <Input.Search
              allowClear
              placeholder="姓名 / 参赛号 / 身份证号"
              onSearch={(keyword) => setSearch({ ...search, page: 1, keyword })}
            />
            <Button type="primary" onClick={toPaginate} loading={load}>
              刷新
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          dataSource={data?.data}
          loading={load}
          pagination={{
            current: data?.page,
            pageSize: data?.size,
            total: data?.total,
            showQuickJumper: false,
            showSizeChanger: false,
            onChange: (page) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column title="参赛号" dataIndex="number" width={120} />
          <Table.Column title="姓名" dataIndex="name" width={120} />
          <Table.Column title="单位" dataIndex="unit" ellipsis />
          <Table.Column title="小组" dataIndex="group_name" width={140} />
          <Table.Column title="身份证号" dataIndex="id_card" width={180} />
          <Table.Column
            title="申诉原因"
            dataIndex="reason"
            ellipsis={{ showTitle: false }}
            render={(reason: string) => (
              <Tooltip placement="topLeft" title={reason}>
                {reason}
              </Tooltip>
            )}
          />
          <Table.Column
            title="提交时间"
            align="center"
            width={160}
            render={(record: APISiteAppeals.Data) =>
              record.created_at && dayjs(record.created_at).format('YYYY-MM-DD HH:mm')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={100}
            render={(record: APISiteAppeals.Data) => (
              <Button type="link" onClick={() => onDetail(record)}>
                详情
              </Button>
            )}
          />
        </Table>
      </Card>

      <Modal
        title="申诉详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={640}
      >
        <Divider style={{ margin: '12px 0 24px 0' }} />
        <Spin spinning={detailLoad}>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="姓名">{detail?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="参赛号">{detail?.number || '-'}</Descriptions.Item>
            <Descriptions.Item label="所属单位">{detail?.unit || '-'}</Descriptions.Item>
            <Descriptions.Item label="所属小组">{detail?.group_name || '-'}</Descriptions.Item>
            <Descriptions.Item label="身份证号" span={2}>
              {detail?.id_card || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="提交时间" span={2}>
              {detail?.created_at && dayjs(detail.created_at).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="申诉原因" span={2}>
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 240, overflowY: 'auto' }}>
                {detail?.reason || '-'}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      </Modal>
    </>
  );
};

export default Paginate;

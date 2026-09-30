import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table } from 'antd';
import { doPaginate } from './service';
import Constants from '@/utils/Constants';
import dayjs from 'dayjs';

const Paginate: React.FC = () => {
  const [search, setSearch] = useState<APISiteCheckins.Search>({});
  const [load, setLoad] = useState(false);
  const [data, setData] = useState<APIData.Paginate<APISiteCheckins.Data>>();

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

  useEffect(() => {
    toPaginate();
  }, [search]);

  return (
    <Card
      title="签到管理"
      extra={
        <Space size={[10, 10]}>
          <Input.Search
            allowClear
            placeholder="姓名"
            onSearch={(name) => setSearch({ ...search, page: 1, name })}
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
        <Table.Column title="ID" dataIndex="id" width={100} align="center" />
        <Table.Column title="姓名" dataIndex="name" />
        <Table.Column
          title="签到时间"
          align="center"
          render={(record: APISiteCheckins.Data) =>
            record.created_at && dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss')
          }
        />
      </Table>
    </Card>
  );
};

export default Paginate;

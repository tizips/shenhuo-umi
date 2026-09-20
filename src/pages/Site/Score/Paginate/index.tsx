import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import { Button, Card, Divider, Input, notification, Popconfirm, Space, Table } from 'antd';
import Editor from '@/pages/Site/Score/Editor';
import Import from '@/pages/Site/Score/Import';
import Notify from './Notify';
import { doDelete, doPaginate } from './service';
import Constants from '@/utils/Constants';
import Loop from '@/utils/Loop';
import dayjs from 'dayjs';

const Paginate: React.FC = () => {
  const access = useAccess();
  const [search, setSearch] = useState<APISiteScores.Search>({});
  const [editor, setEditor] = useState<APISiteScores.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISiteScores.Visible>({});
  const [data, setData] = useState<APIData.Paginate<APISiteScores.Data>>();

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

  const onDelete = (record: APISiteScores.Data) => {
    if (data?.data) {
      const temp = { ...data };
      if (temp.data) {
        Loop.ById(temp.data, record.id, (item) => (item.loading_deleted = true));
      }
      setData(temp);
    }
    doDelete(record.id)
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data?.data) {
          const temp = { ...data };
          if (temp.data) {
            Loop.ById(temp.data, record.id, (item) => (item.loading_deleted = false));
          }
          setData(temp);
        }
      });
  };

  useEffect(() => {
    toPaginate();
  }, [search]);

  return (
    <>
      <Card
        title="成绩列表"
        extra={
          <Space size={[10, 10]}>
            <Input.Search
              allowClear
              placeholder="姓名 / 参赛号"
              onSearch={(keyword) => setSearch({ ...search, page: 1, keyword })}
            />
            <Button type="primary" onClick={toPaginate} loading={load}>
              刷新
            </Button>
            <Access accessible={access.page('site.score.import')}>
              <Button onClick={() => setVisible({ import: true })}>导入</Button>
            </Access>
            <Access accessible={access.page('site.score.notify')}>
              <Button type="primary" onClick={() => setVisible({ notify: true })}>
                推送
              </Button>
            </Access>
            <Access accessible={access.page('site.score.create')}>
              <Button
                onClick={() => {
                  setEditor(undefined);
                  setVisible({ editor: true });
                }}
              >
                创建
              </Button>
            </Access>
          </Space>
        }
      >
        <Divider style={{ marginTop: 0, marginBottom: 16 }} />
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
          <Table.Column title="姓名" dataIndex="name" />
          <Table.Column title="参赛号" dataIndex="number" />
          <Table.Column title="单位" dataIndex="unit" />
          <Table.Column title="小组" dataIndex="group_name" />
          <Table.Column title="总分" dataIndex="total" align="center" />
          <Table.Column title="理论" dataIndex="theory" align="center" />
          <Table.Column title="管理能力" dataIndex="management" align="center" />
          <Table.Column title="心肺复苏" dataIndex="cpr" align="center" />
          <Table.Column title="自救器" dataIndex="respirator" align="center" />
          <Table.Column title="紧急避险" dataIndex="escape" align="center" />
          <Table.Column title="名次" dataIndex="order" align="center" width={80} />
          <Table.Column
            title="创建时间"
            align="center"
            width={120}
            render={(record: APISiteScores.Data) =>
              record.created_at && dayjs(record.created_at).format('YY/MM/DD')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={160}
            render={(record: APISiteScores.Data) => (
              <>
                <Access accessible={access.page('site.score.update')}>
                  <Button
                    type="link"
                    onClick={() => {
                      setEditor(record);
                      setVisible({ editor: true });
                    }}
                  >
                    编辑
                  </Button>
                </Access>
                <Access accessible={access.page('site.score.delete')}>
                  <Popconfirm
                    title="确定要删除该数据?"
                    placement="leftTop"
                    onConfirm={() => onDelete(record)}
                  >
                    <Button type="link" danger loading={record.loading_deleted}>
                      删除
                    </Button>
                  </Popconfirm>
                </Access>
              </>
            )}
          />
        </Table>
      </Card>
      <Import
        visible={visible.import}
        onSave={() => {
          setVisible({ import: false });
          toPaginate();
        }}
        onCancel={() => setVisible({ import: false })}
      />
      <Notify
        visible={visible.notify}
        onCancel={() => setVisible({ notify: false })}
        onSave={() => setVisible({ notify: false })}
      />
      <Editor
        visible={visible.editor}
        params={editor}
        onSave={() => {
          setVisible({ editor: false });
          toPaginate();
        }}
        onCancel={() => setVisible({ editor: false })}
      />
    </>
  );
};

export default Paginate;

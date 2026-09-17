import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import { Button, Card, Input, notification, Popconfirm, Space, Table, Tag } from 'antd';
import Editor from '@/pages/Site/Person/Editor';
import Import from '@/pages/Site/Person/Import';
import { doDelete, doPaginate } from './service';
import Constants from '@/utils/Constants';
import Loop from '@/utils/Loop';
import dayjs from 'dayjs';

const Paginate: React.FC = () => {
  const access = useAccess();
  const [search, setSearch] = useState<APISitePersons.Search>({});
  const [editor, setEditor] = useState<APISitePersons.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISitePersons.Visible>({});
  const [data, setData] = useState<APIData.Paginate<APISitePersons.Data>>();

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

  const onDelete = (record: APISitePersons.Data) => {
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
        title="人员列表"
        extra={
          <Space size={[10, 10]}>
            <Input.Search
              allowClear
              placeholder="姓名 / 参赛号 / 手机号"
              onSearch={(keyword) => setSearch({ ...search, page: 1, keyword })}
            />
            <Button type="primary" onClick={toPaginate} loading={load}>
              刷新
            </Button>
            <Access accessible={access.page('site.person.import')}>
              <Button onClick={() => setVisible({ import: true })}>导入</Button>
            </Access>
            <Access accessible={access.page('site.person.create')}>
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
          <Table.Column title="手机号" dataIndex="mobile" />
          <Table.Column title="单位" dataIndex="unit" />
          <Table.Column title="小组" dataIndex="group_name" />
          <Table.Column
            title="改密"
            align="center"
            render={(record: APISitePersons.Data) =>
              record.must_change_password === 1 ? <Tag color="orange">待改</Tag> : <Tag>否</Tag>
            }
          />
          <Table.Column
            title="创建时间"
            align="center"
            width={120}
            render={(record: APISitePersons.Data) =>
              record.created_at && dayjs(record.created_at).format('YY/MM/DD')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={160}
            render={(record: APISitePersons.Data) => (
              <>
                <Access accessible={access.page('site.person.update')}>
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
                <Access accessible={access.page('site.person.delete')}>
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

import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import { Button, Card, Input, notification, Popconfirm, Space, Switch, Table } from 'antd';
import Editor from '@/pages/Site/Manager/Editor';
import Enable from '@/components/Basic/Enable';
import { doDelete, doEnable, doPaginate } from './service';
import Constants from '@/utils/Constants';
import Loop from '@/utils/Loop';
import dayjs from 'dayjs';

const Paginate: React.FC = () => {
  const access = useAccess();
  const [search, setSearch] = useState<APISiteManagers.Search>({});
  const [editor, setEditor] = useState<APISiteManagers.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISiteManagers.Visible>({});
  const [data, setData] = useState<APIData.Paginate<APISiteManagers.Data>>();

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

  const onEnable = (record: APISiteManagers.Data) => {
    if (data?.data) {
      const temp = { ...data };
      if (temp.data) {
        Loop.ById(temp.data, record.id, (item) => (item.loading_enable = true));
      }
      setData(temp);
    }

    const enable: APIRequest.Enable<string> = {
      id: record.id,
      is_enable: record.is_enable === 1 ? 2 : 1,
    };

    doEnable(enable)
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: `${enable.is_enable === 1 ? '启用' : '禁用'}成功！` });
          if (data?.data) {
            const temp = { ...data };
            if (temp.data) {
              Loop.ById(temp.data, record.id, (item) => (item.is_enable = enable.is_enable));
            }
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data?.data) {
          const temp = { ...data };
          if (temp.data) {
            Loop.ById(temp.data, record.id, (item) => (item.loading_enable = false));
          }
          setData(temp);
        }
      });
  };

  const onDelete = (record: APISiteManagers.Data) => {
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
        title="管理人员列表"
        extra={
          <Space size={[10, 10]}>
            <Input.Search
              allowClear
              placeholder="姓名 / 手机号"
              onSearch={(keyword) => setSearch({ ...search, page: 1, keyword })}
            />
            <Button type="primary" onClick={toPaginate} loading={load}>
              刷新
            </Button>
            <Access accessible={access.page('site.manager.create')}>
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
          <Table.Column title="手机号" dataIndex="mobile" />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APISiteManagers.Data) => (
              <Access
                accessible={access.page('site.manager.enable')}
                fallback={<Enable is_enable={record.is_enable} />}
              >
                <Switch
                  size="small"
                  checked={record.is_enable === 1}
                  onClick={() => onEnable(record)}
                  loading={record.loading_enable}
                />
              </Access>
            )}
          />
          <Table.Column
            title="创建时间"
            align="center"
            width={120}
            render={(record: APISiteManagers.Data) =>
              record.created_at && dayjs(record.created_at).format('YY/MM/DD')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={100}
            render={(record: APISiteManagers.Data) => (
              <>
                <Access accessible={access.page('site.manager.update')}>
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
                <Access accessible={access.page('site.manager.delete')}>
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

import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import {Button, Card, notification, Popconfirm, Select, Space, Table} from 'antd';
import Editor from '@/pages/Site/Draw/Editor';
import { doSiteDrawCategoryOfOpening } from '@/services/site';
import { doDelete, doPaginate } from './service';
import Constants from '@/utils/Constants';
import Loop from '@/utils/Loop';
import dayjs from 'dayjs';

const Paginate: React.FC = () => {
  const access = useAccess();
  const [search, setSearch] = useState<APISiteDraws.Search>({});
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISiteDraws.Visible>({});
  const [data, setData] = useState<APIData.Paginate<APISiteDraws.Data>>();
  const [categories, setCategories] = useState<APISite.Opening[]>([]);

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

  const onDelete = (record: APISiteDraws.Data) => {
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
    doSiteDrawCategoryOfOpening().then((response) => {
      if (response.code === Constants.Success) {
        setCategories(response.data);
      }
    });
  }, []);

  useEffect(() => {
    toPaginate();
  }, [search]);

  return (
    <>
      <Card
        title="抽签结果"
        extra={
          <Space size={[10, 10]}>
            <Select
              allowClear
              placeholder="抽签类别"
              style={{ width: 160 }}
              value={search.category_id}
              onChange={(category_id) => setSearch({ page: 1, category_id })}
              options={categories.map((item) => ({ label: item.name, value: item.id }))}
            />
            <Button type="primary" onClick={toPaginate} loading={load}>
              刷新
            </Button>
            <Access accessible={access.page('site.draw.create')}>
              <Button onClick={() => setVisible({ editor: true })}>抽签</Button>
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
          <Table.Column title="类别" dataIndex="category" />
          <Table.Column title="姓名" dataIndex="name" />
          <Table.Column title="参赛号" dataIndex="number" />
          <Table.Column title="单位" dataIndex="unit" />
          <Table.Column title="小组" dataIndex="group_name" />
          <Table.Column
            title="抽签时间"
            align="center"
            width={140}
            render={(record: APISiteDraws.Data) =>
              record.created_at && dayjs(record.created_at).format('YY/MM/DD HH:mm')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={160}
            render={(record: APISiteDraws.Data) => (
              <Access accessible={access.page('site.draw.delete')}>
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
            )}
          />
        </Table>
      </Card>
      <Editor
        visible={visible.editor}
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

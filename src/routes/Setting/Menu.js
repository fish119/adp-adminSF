import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Divider, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name',
    align:'center',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
    align:'center',
  },
  {
    title: '菜单URL',
    dataIndex: 'path',
    key: 'path',
    align:'center',
  },
  {
    title: '仅管理员可见',
    dataIndex: 'onlySa',
    key: 'onlySa',
    align:'center',
  },
  {
    title: '排序号',
    dataIndex: 'sort',
    key: 'sort',
    align:'center',
  },
  {
    title: '操作',
    align:'center',
    render: () => (
      <Fragment>
        <a href="">编辑</a>
        <Divider type="vertical" />
        <a href="">删除</a>
      </Fragment>
    ),
  },
];

@connect(({ global }) => ({
  userMenus: global.userMenus,
}))
export default class Menu extends PureComponent {
  render() {
    const { userMenus, loading } = this.props;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Table
          // selectedRows={selectedRows}
          loading={loading}
          // data={data}
          columns={columns}
          // onSelectRow={this.handleSelectRows}
          // onChange={this.handleStandardTableChange}
        />
      </PageHeaderLayout>
    );
  }
}

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Form, Input, TreeSelect, Popconfirm, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { formatterTreeSelect } from '../../utils/utils.js';

const FormItem = Form.Item;

@connect(({ global, article, loading }) => ({
  userMenus: global.userMenus,
  article,
  loading: loading.models.article,
}))
@Form.create()
export default class Edit extends PureComponent {
  componentWillMount() {
    console.log(this.props.article.articleid);
  }
  render() {
    const { userMenus, article, loading } = this.props;

    return (
      <PageHeaderLayout userMenus={userMenus}>
        <h1>{article.articleid}</h1>
      </PageHeaderLayout>
    );
  }
}

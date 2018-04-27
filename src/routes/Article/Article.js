import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  Slider,
  TreeSelect,
  message,
  Popconfirm,
  Divider,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { formatterTreeSelect } from '../../utils/utils.js';
import styles from '../../layouts/TableList.less';

const FormItem = Form.Item;

@connect(({ global, article, loading }) => ({
  userMenus: global.userMenus,
  article,
  loading: loading.models.article,
}))
@Form.create()
export default class Article extends PureComponent {
  state = {
    formValues: {},
  };
  componentWillMount() {
    this.props.dispatch({ type: 'article/fetchCategories' });
    this.props.dispatch({ type: 'article/fetchArticles' });
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'article/fetchArticles',
      payload: {},
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'article/fetchArticles',
        payload: values,
      });
    });
  };
  renderSimpleForm(treeData) {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('searchStr')(
                <Input placeholder="标题、副标题" style={{ width: 200 }} />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="类别">
              {getFieldDecorator('category')(
                <TreeSelect
                  treeData={formatterTreeSelect(treeData)}
                  placeholder="Please select"
                  allowClear
                  style={{ width: 120 }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button
                icon="plus"
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => this.handleModalVisible(true, Object.assign({}, newItem))}
              >
                新增
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { userMenus, article: { data }, loading } = this.props;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
      },
      {
        title: '副标题',
        dataIndex: 'subTitle',
        key: 'subTitle',
      },
      {
        title: '发布日期',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '修改日期',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '分类',
        dataIndex: 'category',
        key: 'category',
        render: value => (value ? value.name : '无'),
      },
      {
        title: '操作',
        align: 'center',
        render: record => (
          <Fragment>
            <Button
              type="primary"
              ghost
              onClick={() => this.handleModalVisible(true, Object.assign({}, record))}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="您确定要删除该记录？"
              onConfirm={() => this.handlDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="danger" ghost>
                删除
              </Button>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div style={{ marginBottom: '10px' }} className={styles.tableListForm}>
              {this.renderSimpleForm(data.categories)}
            </div>
            <StandardTable
              loading={loading}
              data={data.articles}
              columns={columns}
              rowKey={record => record.id}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

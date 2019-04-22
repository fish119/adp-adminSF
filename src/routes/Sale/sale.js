import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Button, Form, Input, TreeSelect, Popconfirm, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../../layouts/TableList.less';

const FormItem = Form.Item;

@connect(({ global, sale, loading }) => ({
  userMenus: global.userMenus,
  sale,
  loading: loading.models.sale,
}))
@Form.create()
export default class sale extends PureComponent {
  state = {
    formValues: {},
  };
  componentWillMount() {
    this.props.dispatch({ type: 'sale/fetchSales' });
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sale/fetchSales',
      payload: {},
    });
  };

  gotoEdit = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/sale/sale/edit',
      query: {
        id
      }
    }));
  }
  handlDelete = (id) => {
    this.props.dispatch({
      type: 'sale/deleteSale',
      payload: id,
      callback: this.showSuccess,
    });
  };
  renderSimpleForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button
                icon="plus"
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => this.gotoEdit(-1)}
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
    const { userMenus, sale: { data }, loading } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        key: 'customerName',
        align: 'center',
      },
      {
        title: '平均电价',
        dataIndex: 'pjdj',
        key: 'pjdj',
        align: 'center',
      },
      {
        title: '生效日期',
        dataIndex: 'beginDate',
        key: 'beginDate',
        align: 'center',
      },
      {
        title: '失效日期',
        dataIndex: 'endDate',
        key: 'endDate',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: record => (
          <Fragment>
            <Button
              type="primary"
              ghost
              onClick={() => this.gotoEdit(record.id)}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="您确定要删除该记录？"
              onConfirm={() => this.handlDelete(record.id)}
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
              data={data.sales}
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

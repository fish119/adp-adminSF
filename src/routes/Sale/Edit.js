import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Spin,
  Row,
  Col,
  Card,
  Button,
  Icon,
  Form,
  Input,
  Divider,
  message,
  TreeSelect,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  formatterStringTreeSelect,
  beforeImgUpload,
} from '../../utils/utils.js';

const FormItem = Form.Item;
const newItem = {
  customerName: '',
  code: '',
  pjdj: '',
  fdj: '',
  gdj: '',
  pdj: '',
  beginDate: '',
  endDate: ''
};

@connect(({ global, sale, loading }) => ({
  userMenus: global.userMenus,
  sale,
  loading: loading.models.sale,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    uploading: false,
  };
  componentWillMount() {
    if (this.props.sale.saleid && this.props.sale.saleid > 0) {
      this.props.dispatch({
        type: 'sale/getSale',
        payload: this.props.sale.saleid,
        callback: this.loadArticleSuccess,
      });
    } else {
      this.props.dispatch({ type: 'sale/setNewSale', payload: Object.assign({}, newItem) });
    }
    this.props.dispatch({ type: 'sale/fetchCustomers' });
  }
  loadArticleSuccess = response => {

  };
  uploadCheck = file => {
    return beforeImgUpload(file, message);
  };
  showSuccess = () => {
    message.success('操作成功');
  }
  uploadSuccess = () => {
    this.setState({ uploading: false });
    message.success('操作成功');
  };

  handleSave = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const payload = {
        ...fieldsValue,
        id: this.props.sale.data.sale.id,
        createTime: this.props.sale.data.sale.createTime,
      };
      this.props.dispatch({
        type: 'sale/postSale',
        payload,
        callback: this.showSuccess,
      });
    });
  };

  cancelHandle = () => {
    this.props.form.resetFields();
  };
  goBack = () => {
    history.back();
  };
  render() {
    const { userMenus, sale, loading, form } = this.props;
    const item = sale.data.sale;
    const newLocal = this.state.imageUrl;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Spin spinning={!!loading || this.state.uploading}>
          <Card bordered={false}>
            <Form>
              <Row>               
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="售电编号">
                    {form.getFieldDecorator('code', { initialValue: item.code })(
                      <Input placeholder="请输入售电编号" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="客户名称">
                    {form.getFieldDecorator('customerName', {
                      rules: [{ required: true, message: '请选择客户' }],
                      initialValue: item.customerName ? item.customerName : null,
                    })(
                      <TreeSelect
                        maxLength = "50"
                        treeData={formatterStringTreeSelect(sale.data.customers)}
                        placeholder="Please select"
                        allowClear
                        style={{ width: 230 }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="平均电价">
                    {form.getFieldDecorator('pjdj', { initialValue: item.pjdj })(
                      <Input placeholder="请输入平均电价" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="峰电价">
                    {form.getFieldDecorator('fdj', { initialValue: item.fdj })(
                      <Input placeholder="请输入峰电价" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="谷电价">
                    {form.getFieldDecorator('gdj', { initialValue: item.gdj })(
                      <Input placeholder="请输入谷电价" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="平电价">
                    {form.getFieldDecorator('pdj', { initialValue: item.pdj })(
                      <Input placeholder="请输入平电价" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="生效日期">
                    {form.getFieldDecorator('beginDate', { initialValue: item.beginDate })(
                      <Input format='YYYY-MM-DD' placeholder="生效日期" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="失效日期">
                    {form.getFieldDecorator('endDate', { initialValue: item.endDate })(
                      <Input format='YYYY-MM-DD' placeholder="失效日期" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={24}>
                  <Divider />
                  <div style={{ textAlign: 'center' }}>
                    <FormItem>
                      <Button type="primary" onClick={this.handleSave}>
                        提交
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.cancelHandle}>
                        取消
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.goBack}>
                        返回
                      </Button>
                    </FormItem>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}

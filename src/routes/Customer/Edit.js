import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Radio, Spin, Row, Col, Card, Button, Icon, Form, Input, Divider, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getBaseUrl, getHeaders } from '../../utils/request';
import {
  formatterTreeSelect,
  beforeImgUpload,
  getBase64,
  getObjFromKeys,
} from '../../utils/utils.js';

const { TextArea } = Input;
const FormItem = Form.Item;
const newItem = {
  name: '',
  code: '',
  shortName: '',
  lvl: '',
  address: '',
  contact: '',
  tel: '',
  mobile: '',
  uxCode: '', //税号
  bankName: '', //银行名称
  bankCode: '', //银行账号
};

@connect(({ global, customer, loading }) => ({
  userMenus: global.userMenus,
  customer,
  loading: loading.models.customer,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    uploading: false,
  };
  componentWillMount() {
    if (this.props.customer.customerid && this.props.customer.customerid > 0) {
      this.props.dispatch({
        type: 'customer/getCustomer',
        payload: this.props.customer.customerid,
        callback: this.loadArticleSuccess,
      });
    } else {
      this.props.dispatch({ type: 'customer/setNewCustomer', payload: Object.assign({}, newItem) });
    }
  }
  loadArticleSuccess = response => {};
  uploadCheck = file => {
    return beforeImgUpload(file, message);
  };
  showSuccess = () => {
    message.success('操作成功');
  };
  uploadSuccess = () => {
    this.setState({ uploading: false });
    message.success('操作成功');
  };

  handleSave = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const payload = {
        ...fieldsValue,
        id: this.props.customer.data.customer.id,
        createTime: this.props.customer.data.customer.createTime,
      };
      this.props.dispatch({
        type: 'customer/postCustomer',
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
    const { userMenus, customer, loading, form } = this.props;
    const item = customer.data.customer;
    const newLocal = this.state.imageUrl;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Spin spinning={!!loading || this.state.uploading}>
          <Card bordered={false}>
            <Form>
              <Row>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="客户名称">
                    {form.getFieldDecorator('name', {
                      initialValue: item.name,
                    })(<Input placeholder="请输入名称" maxLength="40" />)}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="客户编号">
                    {form.getFieldDecorator('code', { initialValue: item.code })(
                      <Input placeholder="请输入客户编号" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="客户简称">
                    {form.getFieldDecorator('shortName', { initialValue: item.shortName })(
                      <Input placeholder="请输入客户简称" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电压等级">
                    {form.getFieldDecorator('lvl', { initialValue: item.lvl })(
                      <Input placeholder="请输入电压等级" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话">
                    {form.getFieldDecorator('tel', { initialValue: item.tel })(
                      <Input placeholder="请输入电话" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="传真">
                    {form.getFieldDecorator('fax', { initialValue: item.fax })(
                      <Input placeholder="请输入传真" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="法人">
                    {form.getFieldDecorator('legal', { initialValue: item.legal })(
                      <Input placeholder="请输入法人" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="法人身份证号">
                    {form.getFieldDecorator('legalCode', { initialValue: item.legalCode })(
                      <Input placeholder="请输入法人身份证号" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系人">
                    {form.getFieldDecorator('contact', { initialValue: item.contact })(
                      <Input placeholder="请输入联系人" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系人手机">
                    {form.getFieldDecorator('mobile', { initialValue: item.mobile })(
                      <Input placeholder="请输入联系人手机" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="税号">
                    {form.getFieldDecorator('uxCode', { initialValue: item.uxCode })(
                      <Input placeholder="请输入税号" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开户行名称">
                    {form.getFieldDecorator('bankName', { initialValue: item.bankName })(
                      <Input placeholder="请输入开户行名称" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="银行账号">
                    {form.getFieldDecorator('bankCode', { initialValue: item.bankCode })(
                      <Input placeholder="请输入银行账号" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="地址">
                    {form.getFieldDecorator('address', { initialValue: item.address })(
                      <TextArea
                        style={{ height: '102px' }}
                        row={5}
                        maxLength={200}
                        placeholder="请输入地址"
                      />
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

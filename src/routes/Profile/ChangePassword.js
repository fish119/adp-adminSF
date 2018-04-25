import React, { PureComponent } from 'react';
import md5 from 'js-md5';
import { connect } from 'dva';
import { Card, Button, Spin, Form, Input, message, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

const CreateForm = Form.create({})(props => {
  const { form, handleSave } = props;
  const onCancle = () => {
    form.resetFields();
  };
  const onSave = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSave(fieldsValue);
    });
  };
  const testPassword = (rule, value, callback) => {
    const confirmPassword = form.getFieldProps('confirmPassword').value;
    const password = form.getFieldProps('newPassword').value;
    if (confirmPassword && password) {
      if (confirmPassword === password) {
        callback();
        form.setFieldsValue({
          confirmPassword: password,
        });
      } else {
        callback('两次输入的密码不一致');
      }
    } else {
      callback();
    }
  };
  return (
    <Form>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="原密码">
        {form.getFieldDecorator('oldPassword', {
          rules: [{ required: true, message: '请输入原密码' }],
        })(<Input placeholder="请输入原密码" maxLength="20" type="password" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
        {form.getFieldDecorator('newPassword', {
          rules: [{ required: true, message: '请输入新密码' }, { validator: testPassword }],
        })(<Input placeholder="请输入新密码" maxLength="20" type="password" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
        {form.getFieldDecorator('confirmPassword', {
          rules: [{ required: true, message: '请再次输入新密码' }, { validator: testPassword }],
        })(<Input placeholder="请再次输入新密码" maxLength="20" type="password" />)}
      </FormItem>
      <Divider />
      <div style={{ textAlign: 'center' }}>
        <FormItem>
          <Button type="primary" onClick={onSave}>
            提交
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onCancle}>
            取消
          </Button>
        </FormItem>
      </div>
    </Form>
  );
});

@connect(({ global, loading }) => ({
  userMenus: global.userMenus,
  user: global.currentUser,
  loading: loading.effects['profile/changePassword'],
}))
export default class ChangePassword extends PureComponent {
  handleSave = fieldsValue => {
    const paylad = {
      oldPassword: md5(fieldsValue.oldPassword),
      newPassword: md5(fieldsValue.newPassword),
    };
    this.props.dispatch({
      type: 'profile/changePassword',
      payload: paylad,
      callback: this.showSuccess,
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  showSuccess = () => {
    this.formRef.resetFields();
    message.success('操作成功');
  };
  render() {
    const { userMenus, loading } = this.props;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Spin spinning={!!loading}>
          <Card bordered={false}>
            <CreateForm ref={this.saveFormRef} handleSave={this.handleSave} />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}

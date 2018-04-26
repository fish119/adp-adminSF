import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Upload, Row, Col, Card, Button, Spin, Form, Input, message, Divider } from 'antd';
import { regPhone, regEmail, baseImgUrl } from '../../utils/constant';
import { beforeUpload } from '../../utils/utils';
import { getBaseUrl, getHeaders } from '../../utils/request';
import { checkUsername, checkNickname, checkPhone, checkEmail } from '../../utils/check';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const UserForm = Form.create({})(props => {
  const { form, handleSave, item, testUserName, testNickname, testEmail, testPhone } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSave(fieldsValue);
    });
  };
  const cancelHandle = () => {};
  return (
    <Form>
      <Row>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="用户名">
            {form.getFieldDecorator('username', {
              initialValue: item.username,
              rules: [{ required: true, message: '请输入用户名...' }, { validator: testUserName }],
              validateTrigger: 'onBlur',
            })(<Input placeholder="请输入" maxLength="10" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="昵称">
            {form.getFieldDecorator('nickname', {
              initialValue: item.nickname,
              rules: [{ required: true, message: '请输入昵称...' }, { validator: testNickname }],
              validateTrigger: 'onBlur',
            })(<Input placeholder="请输入" maxLength="10" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="手机号码">
            {form.getFieldDecorator('phone', {
              initialValue: item.phone,
              rules: [
                { required: true, message: '请输入手机号码...' },
                { pattern: new RegExp(regPhone), message: '请输入正确的手机号码' },
                { validator: testPhone },
              ],
              validateTrigger: 'onBlur',
            })(<Input placeholder="请输入" maxLength="11" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="email">
            {form.getFieldDecorator('email', {
              initialValue: item.email,
              rules: [
                { pattern: new RegExp(regEmail), message: '请输入正确Email' },
                { validator: testEmail },
              ],
              validateTrigger: 'onBlur',
            })(<Input placeholder="请输入" maxLength="50" />)}
          </FormItem>
        </Col>
        <Col sm={24} md={24}>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <FormItem>
              <Button type="primary" onClick={okHandle}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={cancelHandle}>
                取消
              </Button>
            </FormItem>
          </div>
        </Col>
      </Row>
    </Form>
  );
});
@connect(({ global, profile, loading }) => ({
  userMenus: global.userMenus,
  currentUser: global.currentUser,
  profile,
  loading: loading.models.profile,
}))
export default class Profile extends PureComponent {
  state = {
    uploading: false,
  };
  testUserName = (rule, value, callback) => {
    checkUsername(
      rule,
      value,
      callback,
      this.props.currentUser.id ? this.props.currentUser.id : -1
    );
  };
  testNickname = (rule, value, callback) => {
    checkNickname(
      rule,
      value,
      callback,
      this.props.currentUser.id ? this.props.currentUser.id : -1
    );
  };
  testEmail = (rule, value, callback) => {
    checkEmail(rule, value, callback, this.props.currentUser.id ? this.props.currentUser.id : -1);
  };
  testPhone = (rule, value, callback) => {
    checkPhone(rule, value, callback, this.props.currentUser.id ? this.props.currentUser.id : -1);
  };
  saveSuccess = response => {
    message.success('操作成功');
    this.props.dispatch({ type: 'global/changeUser', payload: response.data });
  };
  handleSave = fields => {
    const profile = {
      ...this.props.currentUser,
      username: fields.username,
      nickname: fields.nickname,
      phone: fields.phone,
      email: fields.email,
    };
    this.props.dispatch({
      type: 'profile/saveProfile',
      payload: profile,
      callback: this.saveSuccess,
    });
  };
  uploadCheck = file => {
    beforeUpload(file, message);
  };
  uploadSuccess = () => {
    this.setState({ uploading: false });
    message.success('操作成功');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  handleUpload = info => {
    if (info.file.status === 'uploading') {
      this.setState({ uploading: true });
    }
    if (info.file.status === 'done') {
      if (info.file.response && info.file.response.status === 'success') {
        this.uploadSuccess(info.file.response.data);
      } else {
        message.error('上传失败，请重试...');
      }
    }
  };
  render() {
    const { userMenus, loading, currentUser } = this.props;
    const parentMethods = {
      testUserName: this.testUserName,
      testNickname: this.testNickname,
      testPhone: this.testPhone,
      testEmail: this.testEmail,
      handleSave: this.handleSave,
    };
    const baseUrl = getBaseUrl();
    const headers = getHeaders();
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Spin spinning={!!loading || this.state.uploading}>
          <Row gutter={24}>
            <Col md={7} sm={24} style={{ marginBottom: '20px' }}>
              <Row type="flex" justify="center">
                <Col>
                  <Upload
                    name="avatar"
                    listType="picture"
                    showUploadList={false}
                    action={`${baseUrl}setting/profile/setAvatar`}
                    headers={headers}
                    onChange={this.handleUpload}
                    style={{ cursor: 'pointer' }}
                    beforeUpload={this.uploadCheck}
                  >
                    <img
                      style={{ width: '100px', heigth: '100px' }}
                      src={`${baseImgUrl}avatar/${
                        currentUser.avatar ? currentUser.avatar : 'avatar.png'
                      }`}
                      alt=""
                    />
                  </Upload>
                </Col>
              </Row>
              <Row type="flex" justify="center" style={{ marginTop: '20px' }}>
                <Col>
                  <h1>{currentUser.nickname}</h1>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col>
                  <span className="description">创建时间</span>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col>
                  <span className="description">{currentUser.createTime}</span>
                </Col>
              </Row>
            </Col>
            <Col md={17} sm={24}>
              <Card bordered={false}>
                <UserForm {...parentMethods} item={currentUser} />
              </Card>
            </Col>
          </Row>
        </Spin>
      </PageHeaderLayout>
    );
  }
}

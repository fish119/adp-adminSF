import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Radio,
  Upload,
  Spin,
  Row,
  Col,
  Card,
  Button,
  Icon,
  Form,
  Input,
  TreeSelect,
  Popconfirm,
  Divider,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getBaseUrl, getHeaders } from '../../utils/request';
import {
  formatterTreeSelect,
  beforeImgUpload,
  getBase64,
  getObjFromKeys,
} from '../../utils/utils.js';
import { regPhone, regEmail, baseImgUrl } from '../../utils/constant';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const FormItem = Form.Item;
const newItem = {
  title: '',
  subTitle: '',
  description: '',
  thumbnail: null,
  content: '',
  isTop: false,
};

@connect(({ global, article, loading }) => ({
  userMenus: global.userMenus,
  article,
  loading: loading.models.article,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    uploading: false,
  };
  componentWillMount() {
    if (this.props.article.articleid && this.props.article.articleid > 0) {
      this.props.dispatch({
        type: 'article/getArticle',
        payload: this.props.article.articleid,
        callback: this.loadArticleSuccess,
      });
    } else {
      this.props.dispatch({ type: 'article/setNewArticle', payload: Object.assign({}, newItem) });
    }
    this.props.dispatch({ type: 'article/fetchCategories' });
  }
  loadArticleSuccess = response => {
    if (response.data.thumbnail) {
      this.setState({
        imageUrl: `${baseImgUrl}article/${response.data.thumbnail}`,
      });
    }
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
  thumbnailChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ uploading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          uploading: false,
        })
      );
    }
  };
  handleSave = () => {
    console.log('handleSave');
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newCategory =
        fieldsValue.category ===
        (this.props.article.data.article.category
          ? this.props.article.data.article.category.id
          : null)
          ? this.props.article.data.article.category
          : getObjFromKeys([fieldsValue.category], this.props.article.data.categories)[0];
      const payload = {
        ...fieldsValue,
        category: newCategory,
        id: this.props.article.data.article.id,
        createTime: this.props.article.data.article.createTime,
      };
      console.log(payload);
      this.props.dispatch({
        type: 'article/postArticle',
        payload,
        callback: this.showSuccess,
      });
    });
  };
  clearThumbnail = () => {
    this.setState({
      imageUrl: null,
    });
    this.props.form.setFieldsValue({
      thumbnail: null,
    });
  };
  cancelHandle = () => {
    this.props.form.resetFields();
    if (this.props.article.data.article.thumbnail) {
      this.setState({
        imageUrl: `${baseImgUrl}article/${this.props.article.data.article.thumbnail}`,
      });
    } else {
      this.setState({
        imageUrl: null,
      });
    }
  };
  goBack = () => {
    history.back();
  };
  render() {
    const { userMenus, article, loading, form } = this.props;
    const item = article.data.article;
    const uploadButton = (
      <div>
        <Icon type={this.state.uploading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const baseUrl = getBaseUrl();
    const headers = getHeaders();
    const newLocal = this.state.imageUrl;
    const imageUrl = newLocal;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Spin spinning={!!loading || this.state.uploading}>
          <Card bordered={false}>
            <Form>
              <Row>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
                    {form.getFieldDecorator('title', {
                      initialValue: item.title,
                      rules: [{ required: true, message: '请输入标题' }],
                    })(<Input placeholder="请输入标题" maxLength="40" />)}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="副标题">
                    {form.getFieldDecorator('subTitle', { initialValue: item.subTitle })(
                      <Input placeholder="请输入副标题" maxLength="50" />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否置顶">
                    {form.getFieldDecorator('isTop', { initialValue: item.isTop })(
                      <RadioGroup>
                        <Radio value>是</Radio>
                        <Radio value={false}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类别">
                    {form.getFieldDecorator('category', {
                      rules: [{ required: true, message: '请选择类别' }],
                      initialValue: item.category ? item.category.id.toString() : null,
                    })(
                      <TreeSelect
                        treeData={formatterTreeSelect(article.data.categories)}
                        placeholder="Please select"
                        allowClear
                        style={{ width: 120 }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
                    {form.getFieldDecorator('description', { initialValue: item.description })(
                      <TextArea
                        style={{ height: '102px' }}
                        row={5}
                        maxLength={200}
                        placeholder="请输入描述"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="缩略图">
                    {form.getFieldDecorator('thumbnail', { initialValue: item.thumbnail })(
                      <Row>
                        <Col sm={20}>
                          <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            headers={headers}
                            showUploadList={false}
                            action={`${baseUrl}setting/profile/setAvatar`}
                            beforeUpload={this.uploadCheck}
                            onChange={this.thumbnailChange}
                          >
                            {imageUrl ? (
                              <img style={{ height: '102px' }} src={imageUrl} alt="" />
                            ) : (
                              uploadButton
                            )}
                          </Upload>
                        </Col>
                        <Col sm={4}>
                          {imageUrl ? <Button onClick={this.clearThumbnail}>清除</Button> : ''}
                        </Col>
                      </Row>
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

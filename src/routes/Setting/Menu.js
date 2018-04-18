import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Divider, Table, Icon,Card,Button,Form,Modal,Input,Radio,Slider,TreeSelect,message,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../../layouts/TableList.less';
import {formatterTree} from '../../utils/utils.js'

const newItem={name:'',path:'',onlySa:false,sort:0}
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CreateForm = Form.create({
  onValuesChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        value: props.item.name,
      }),
      path: Form.createFormField({
        value: props.item.path,
      }),
      onlySa: Form.createFormField({
        value: props.item.onlySa,
      }),
      sort: Form.createFormField({
        value: props.item.sort,
      }),
      icon: Form.createFormField({
        value: props.item.icon,
      }),
      pid: Form.createFormField({
        value: props.item.pid?props.item.pid.toString():'',
      }),
    };
  },
})(props => {
  const { modalVisible, form, handleSave, handleModalVisible ,item,treeData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSave(fieldsValue);
    });
  };
  
  return (
    <Modal
      title={item!=null?"编辑菜单":"新建菜单"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false,{name:'',path:'',onlySa:false,sort:0})}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入菜单名称...' }],
        })(<Input placeholder="请输入" maxLength="10" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单URL">
        {form.getFieldDecorator('path', {
          rules: [{ required: true, message: '请输入菜单URL...' }],
        })(<Input placeholder="请输入"  maxLength="10" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单图标">
        {form.getFieldDecorator('icon',{})(<Input placeholder="请输入" addonBefore={<Icon type={item.icon} />} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级菜单">
        {form.getFieldDecorator('pid',{})(
          <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={formatterTree(treeData)}
            placeholder="Please select"
            treeDefaultExpandAll
            onChange={this.onChange}
            allowClear
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="仅超管可见">
        {form.getFieldDecorator('onlySa', {})(
          <RadioGroup>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单序号">
        {form.getFieldDecorator('sort', {})(<Slider />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ global, menu, loading }) => ({
  userMenus: global.userMenus,
  menu,
  loading: loading.models.menu,
}))
export default class Menu extends PureComponent {
  state = {
    modalVisible: false,
    item:Object.assign({},newItem),
  }
  componentWillMount() {
    this.props.dispatch({ type: 'menu/fetch' });
  };  
  handleModalVisible = (flag,record) => {
    this.setState({
      modalVisible: !!flag,
      item:record,
    });
  };
  handleFormChange=(changedFields) => {
    this.setState({
      item: Object.assign(this.state.item,changedFields)
    });
  };
  showSuccess=(response)=>{
    message.success('操作成功');
    this.props.dispatch({ type: 'global/changeMenu',payload:response.userMenus });
  };
  handleSave = fields => {
    this.props.dispatch({
      type: 'menu/saveMenu',
      payload: {...fields,id:this.state.item.id},
      callback:this.showSuccess,
    });
    
    this.setState({
      modalVisible: false,
      item:Object.assign({},newItem),
    });
  };
  handlDelete = (param) => {
    this.props.dispatch({
      type: 'menu/deleteMenu',
      payload: param.id,
      callback:this.showSuccess,
    });
  };
  columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      align: 'center',
      render: icon => <Icon type={icon} />,
    },
    {
      title: '菜单URL',
      dataIndex: 'path',
      key: 'path',
      align: 'center',
    },
    {
      title: '仅管理员可见',
      dataIndex: 'onlySa',
      key: 'onlySa',
      align: 'center',
      render:value=> value?'是':'否',
    },
    {
      title: '排序号',
      dataIndex: 'sort',
      key: 'sort',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <Button type="primary" ghost onClick={() => this.handleModalVisible(true,Object.assign({},record))}>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm title="您确定要删除该记录？" onConfirm={() =>this.handlDelete(record)} okText="确定" cancelText="取消">
            <Button type="danger" ghost>删除</Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  render() {
    const { userMenus, menu: { data }, loading } = this.props;
    const { modalVisible,item } = this.state;
    const parentMethods = {
      handleSave: this.handleSave,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button style={{marginBottom:'1em'}}  icon="plus" type="primary" onClick={() => this.handleModalVisible(true,Object.assign({},newItem))}>
                新建
              </Button>
            </div>
            <Table
              // selectedRows={selectedRows}
              loading={loading}
              dataSource={data.list}
              columns={this.columns}            
              // onSelectRow={this.handleSelectRows}
              // onChange={this.handleStandardTableChange}
              rowKey="id"
            />
          </div>
        </Card>
        <CreateForm treeData={data.list} {...parentMethods} modalVisible={modalVisible} item={item} onChange={this.handleFormChange} />
      </PageHeaderLayout>      
    );
  };
}
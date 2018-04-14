import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ global }) => ({
  userMenus: global.userMenus,
}))
export default class Menu extends Component {  
  render() {
    const {userMenus} = this.props;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <div>
          <h1>Menu</h1>
        </div>
      </PageHeaderLayout>
    );
  }
}

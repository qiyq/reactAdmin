import { Button, Divider, message, Input, Table, Card } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { InstitutionStateType } from '@/models/institution';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { InstitutionListItem } from './data.d';
import { ColumnProps,TablePaginationConfig } from 'antd/es/table';
import classNames from 'classnames';
import styles from './style.less';
import { EntrListParamsType } from '@/services/insititution';
interface InstitutionProp {
  className?: string;
  dispatch: Dispatch;
  loading?: boolean;
  institutionState: InstitutionStateType;
}

// const handleAdd = async (fields: InstitutionListItem) => {};

const InstitutionList: React.FC<InstitutionProp> = (props) => {
  const { dispatch, institutionState, loading } = props;
  const { params, list } = institutionState;

  // 获取列表数据
  const getList = () => {
    if (dispatch) {
      dispatch({
        type: 'institution/getList',
        payload: params,
      });
    }
  };
  const pagination:TablePaginationConfig = {
    current: params.pageNo,
    total: params.totalCount,
    pageSizeOptions: ['10', '20', '50'],
    onChange(page: number) {
      params.pageNo = page;
      getList();
    },
    onShowSizeChange(_current:number,size: number) {
      params.pageSize = size;
      getList();
    },
  };
  useEffect(() => {
    getList();
  }, []); // 第二个参数，当组件销毁的时候解绑作用
  const columns: ColumnProps<InstitutionListItem>[] = [
    {
      title: '区域',
      dataIndex: 'areaName',
      key: 'areaName',
      align: 'center',
    },
    {
      title: '企业ID',
      dataIndex: 'entrId',
      align: 'center',
    },
    {
      title: '企业名称',
      dataIndex: 'name',
      align: 'center',
    },

    {
      title: '使用空间（M）',
      dataIndex: 'used',
      align: 'center',
    },
    {
      title: '空间上限（M）',
      dataIndex: 'total',
      align: 'center',
    },
    {
      title: '用户类型',
      dataIndex: 'state',
      align: 'center',
    },
    {
      title: '到期时间',
      dataIndex: 'expireTime',

      align: 'center',
    },
    {
      title: '套餐包类型',
      align: 'center',
      dataIndex: 'status',
    },
    {
      title: '联系方式',
      dataIndex: 'concat',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',

      align: 'center',
    },
  ];

  return (
    <div className={classNames(styles.institution)}>
      <Table
        className={styles.table}
        bordered
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={pagination}
      />
    </div>
  );
};
export default connect(({ institution, loading }: ConnectState) => ({
  institutionState: institution,
  loading: loading.effects['institution/getList'],
}))(InstitutionList);

import { Button, Divider, message, Input, Table, Card } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { InstitutionListItem } from './data.d';
import { ColumnProps } from 'antd/es/table';
import classNames from 'classnames';
import style from './style.less';
interface InstitutionProp {
  className?: string;
  dispatch: Dispatch;
}

const handleAdd = async (fields: InstitutionListItem) => {};

const InstitutionList: React.FC<InstitutionProp> = (props) => {
  const { dispatch } = props;
  const { params } = useState<InstitutionProp>();
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'global/imgPre',
      });
    }
  }, []); //第二个参数，当组件销毁的时候解绑作用
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
    <div className={classNames(style.institution)}>
      <Table className={style.table} bordered={true} rowKey="key" columns={columns}></Table>
    </div>
  );
};
export default connect(({ login, loading }: ConnectState) => ({}))(InstitutionList);

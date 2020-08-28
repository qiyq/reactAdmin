import { Alert, Form, Input, Button } from 'antd';
import React from 'react';
import { connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from './style.less';

const FormItem = Form.Item;

interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
  style?: React.CSSProperties;
  onSubmit?: (values: LoginParamsType) => void;
  className?: string;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
const Login: React.FC<LoginProps> = (props) => {
  const { userLogin, submitting } = props;
  const { status, from, message } = userLogin;
  const clsString = classNames(styles.submit);
  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, from },
    });
  };
  return (
    <div className={styles.main}>
      <div className={classNames(styles.login)}>
        {!status && !submitting && <LoginMessage content={message} />}
        <Form
          onFinish={(values) => {
            handleSubmit(values as LoginParamsType);
          }}
        >
          <FormItem name="username" rules={[{ required: true, message: '请输入用户昵称!' }]}>
            <Input
              id="userName"
              placeholder="请输入用户昵称"
              size="large"
              prefix={
                <UserOutlined
                  style={{
                    color: '#1890ff',
                  }}
                  className={styles.prefixIcon}
                />
              }
            />
          </FormItem>
          <FormItem name="password" rules={[{ required: true, message: '请输入用户密码!' }]}>
            <Input.Password
              id="password"
              size="large"
              placeholder="请输入用户密码"
              prefix={<LockTwoTone className={styles.prefixIcon} />}
            />
          </FormItem>
          <FormItem>
            <Button size="large" type="primary" htmlType="submit" className={clsString}>
              登 录
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);

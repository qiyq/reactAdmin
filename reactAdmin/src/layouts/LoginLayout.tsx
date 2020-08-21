import { MenuDataItem } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, ConnectProps, connect } from 'umi';
import React from 'react';
import { ConnectState } from '@/models/connect';
import LoginForm from '../pages/login/index'
import logo from '../assets/logo.svg';
import styles from './LoginLayout.less';

export interface LoginLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const LoginLayout: React.FC<LoginLayoutProps> = () => {
  const title = '系统登录';
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/login">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>流量监控后台系统</span>
              </Link>
            </div>
            <div className={styles.desc}>管理系统例子</div>
          </div>
          <LoginForm />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(LoginLayout);

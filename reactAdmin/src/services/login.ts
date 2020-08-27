import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
  from: number;
}

export async function login(params: LoginParamsType) {
  return request('apis/login', {
    method: 'POST',
    data: params,
  });
}
export async function imgPre() {
  return request('apis/common/image-prefix', {
    method: 'get',
  });
}

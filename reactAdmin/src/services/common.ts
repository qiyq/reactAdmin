import request from '@/utils/request';

export async function imgPre() {
  return request('apis/common/image-prefix', {
    method: 'get',
  });
}

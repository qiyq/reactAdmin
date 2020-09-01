import request from '@/utils/request';

export interface EntrListParamsType {
  areaCode?: string;
  startTime?: string;
  endTime?: string;
  entrName?: string;
  entrId?: number | string;
  pageNo: number;
  pageSize: number;
  totalCount: number;
  state: number | null;
}

export async function entrList(params: EntrListParamsType) {
  return request('apis/axadmin/space/list', {
    method: 'POST',
    data: params,
  });
}
export async function entrById(params: { entrId: number }) {
  return request('apis/axadmin/topic/entr-name', {
    method: 'get',
    data: params,
  });
}

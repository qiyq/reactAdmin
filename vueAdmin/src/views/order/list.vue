<template>
  <el-card class="order-list listCard">
    <el-form :inline="true" class="searchForm" :model="searchObj" size="small">
      <el-form-item>
        <el-select v-model="searchObj.status" placeholder="请选择套餐包类型" class="select" clearable>
          <el-option v-for="(item,index) in blackType" :label="item.name" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.status" placeholder="请选择订单状态" class="select" clearable>
          <el-option v-for="(item,index) in blackType" :label="item.name" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.tel" placeholder="请输入机构名称" clearable
                  prefix-icon="el-icon-search"
                  style="width:217px"></el-input>
      </el-form-item>
      <el-form-item class="form-search">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="danger" @click="$resetSearchData()">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="totalInfo">
      <el-card shadow="always">
        <div>全部订单</div>
        <div>2000</div>
      </el-card>
      <el-card shadow="always">
        <div>订单金额</div>
        <div>2000</div>
      </el-card>
      <el-card shadow="always">
        <div>退款金额</div>
        <div>2000</div>
      </el-card>
    </div>
    <el-table class="singer-table" v-loading="loading" element-loading-text="加载中..."
              height="calc(100% - 150px)"
              border :data="list">

      <el-table-column prop='username' label="开通时间" align="center"
                       :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column label="到期时间" align="center" prop="name">
      </el-table-column>
      <el-table-column label="企业名称" prop="tel" align="center"></el-table-column>
      <el-table-column label="订单金额" align="center">
        <template slot-scope="scope">
          {{scope.row.roleType === 4 ? '用户' : '企业'}}
        </template>
      </el-table-column>
      <el-table-column label="套餐包类型" align="center">
        <template slot-scope="scope">
          {{scope.row.status ? '白名单' : '黑名单'}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          {{scope.row.lastLoginTime | dateFormat('yyyy-MM-dd hh:ss:mm')}}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-show="list.length > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="searchObj.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="searchObj.pageSize"
        :total="searchObj.totalCount">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: 'orderList',
    data() {
      return {
        loading: false,
        list: [],
        blackType: [
          {
            id: 1,
            name: '白名单'
          },
          {
            id: 2,
            name: '黑名单'
          },
        ],
        searchObj: {
          pageNo: 1,
          pageSize: 10,
          roleType: '',
          status: '',
          tel: '',
          username: '',
        }
      };
    },
    created() {
      this.searchObj.roleType = parseInt(this.baseActive, 10);
      this.getList();
    },
    methods: {
      handleClick() {
        this.searchObj.roleType = parseInt(this.baseActive, 10);
        this.getList();
      },
      joinBlack(id, status) {
        this.$confirm(`确定${status ? '加入黑名单' : '移除白名单'}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('blackJoin', {
              userId: id,
              status: status,
              roleType: this.searchObj.roleType
            })
              .then((res) => {
                if (res.success) {
                  this.$message({
                    type: 'success',
                    message: '操作成功!',
                  });
                  this.getList();
                } else {
                  this.$message.error(res.msg);
                }
              });

          });

      },
      getList() {
        this.loading = true;
        this.$model('blackList', this.searchObj)
          .then((res) => {
            if (res.success) {
              this.list = res.data.records;
              this.searchObj.pageNo = res.data.current;
              this.searchObj.totalCount = res.data.total;
              this.loading = false;
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      search() {
        this.searchObj.pageNo = 1;
        this.getList();
      },
      // 分页
      handleCurrentChange(val) {
        this.searchObj.pageNo = val;
        this.getList();
      },
      handleSizeChange(val) {
        this.searchObj.pageSize = val;
        this.getList();
      },
    }
  };
</script>

<style scoped lang="less">
  .order-list {
    height: 100%;

    .totalInfo {
      display: flex;
      margin-bottom: 20px;

      .el-card {
        margin-right: 30px;
      }
    }
  }
</style>

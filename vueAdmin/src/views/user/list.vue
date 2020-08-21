<template>
  <el-card class="user-list listCard">
    <el-tabs v-model="baseActive" type="card" @tab-click="handleClick">
      <el-tab-pane label="用户" name="4"></el-tab-pane>
      <el-tab-pane label="企业" name="5"></el-tab-pane>
    </el-tabs>
    <el-form :inline="true" class="searchForm" :model="searchObj" size="small">
      <el-form-item>
        <el-select v-model="searchObj.status" placeholder="请选择状态" class="select" clearable>
          <el-option v-for="(item,index) in blackType" :label="item.name" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.username"
                  :placeholder="baseActive === '4' ? '请输入账号' :'请输入企业主体名称'" clearable
                  prefix-icon="el-icon-search"
                  style="width:217px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.tel" placeholder="请输入手机号码" clearable
                  prefix-icon="el-icon-search"
                  style="width:217px"></el-input>
      </el-form-item>
      <el-form-item class="form-search">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="danger" @click="$resetSearchData()">重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table class="singer-table" v-loading="loading" element-loading-text="加载中..."
              height="calc(100% - 150px)"
              border :data="list">

      <el-table-column prop='username' :label="baseActive === '4' ?'用户账号':'企业主体名称'" align="center"
                       :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="name">
      </el-table-column>
      <el-table-column label="手机号码" prop="tel" align="center"></el-table-column>
      <el-table-column label="用户类型" align="center">
        <template slot-scope="scope">
          {{scope.row.roleType === 4 ? '用户' : '企业'}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{scope.row.status ? '白名单' : '黑名单'}}
        </template>
      </el-table-column>
      <el-table-column label="上次登录时间" v-if="baseActive === '4'" align="center">
        <template slot-scope="scope">
          {{scope.row.lastLoginTime | dateFormat('yyyy-MM-dd hh:ss:mm')}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" v-if="baseActive === '4'" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFormat('yyyy-MM-dd hh:ss:mm')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button @click="joinBlack(scope.row.userId,scope.row.status)" type="text" size="mini">
            {{scope.row.status ? '加入黑名单' : '移除白名单'}}
          </el-button>
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
    name: 'userList',
    data() {
      return {
        baseActive: '4',
        loading: false,
        list: [],
        blackType: [
          {
            id: true,
            name: '白名单'
          },
          {
            id: false,
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
      this.getList();
    },
    methods: {
      handleClick() {
        this.$resetSearchData();
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
              status: !status,
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
        this.searchObj.roleType = parseInt(this.baseActive, 10);
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
  .user-list {
    height: 100%;
  }
</style>

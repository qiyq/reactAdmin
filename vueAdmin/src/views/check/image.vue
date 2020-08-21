<template>
  <el-card class="image-check listCard">
    <el-tabs v-model="baseActive" type="card" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="0"></el-tab-pane>
      <el-tab-pane label="已通过" name="1"></el-tab-pane>
<!--      <el-tab-pane label="已拒绝" name="-1"></el-tab-pane>-->
      <!--      <el-tab-pane label="复审" name="2"></el-tab-pane>-->
    </el-tabs>
    <el-form :inline="true" class="searchForm" :model="searchObj" size="small">
      <el-form-item>
        <el-select v-model="searchObj.topicId" placeholder="请选择专题" class="select" clearable>
          <el-option v-for="(item,index) in topicList" :label="item.title" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.roleType" placeholder="发布人性质" class="select" clearable>
          <el-option v-for="(item,index) in roleTypeList" :label="item.name" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.daterange"
          type="daterange"
          @change="changeDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.publisher" placeholder="请输入发布人" clearable
                  prefix-icon="el-icon-search"
                  style="width:217px"></el-input>
      </el-form-item>
      <el-form-item class="form-search">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="danger" @click="$resetSearchData()">重置
        </el-button>
      </el-form-item>
      <el-form-item class="form-search pull-right">
        <el-button type="success" class="systemColor" v-show="baseActive !== '1'"
                   @click="checkEvent(1,true)">
          批量通过
        </el-button>
        <!--        <el-button type="warning" class="systemSubColor" @click="download">批量拒绝</el-button>-->
      </el-form-item>
    </el-form>
    <el-table class="singer-table" v-loading="loading" element-loading-text="加载中..."
              height="calc(100% - 150px)"
              border :data="list" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column prop='instName' label="内容" align="center" width="166"
                       :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <el-image
            :src="scope.row.url[0]"
            class="en-img"
            :preview-src-list="scope.row.url">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <span class="img-tag"
                v-if="scope.row.url.length > 0">{{scope.row.url.length}}张</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="图片描述" align="center">

      </el-table-column>
      <el-table-column prop='entrName' label="所属企业" align="center"></el-table-column>
      <el-table-column prop='topicName' label="所属专题" align="center"></el-table-column>
      <el-table-column prop='publisher' label="发布人" align="center"></el-table-column>
      <el-table-column prop='createTime' label="发布时间" align="center"></el-table-column>
      <el-table-column label="拒绝原因" align="center"
                       v-if="baseActive === '-1' || baseActive === '2'">
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260px">
        <template slot-scope="scope">
          <el-button @click="checkEvent(1,false,scope.row.id)" v-if="baseActive !== '1'" type="text"
                     size="mini">通过
          </el-button>
          <el-button @click="checkEvent(-1,false,scope.row.id)" v-if="baseActive !== '-1'"
                     type="text" size="mini">拒绝
          </el-button>
          <el-button @click="joinHot(scope.row.id,scope.row.isHot)" type="text" size="mini">
            {{scope.row.isHot ?
            '取消热门':'加入热门'}}
          </el-button>
          <el-button @click="handleBlack(scope.row.userId,scope.row.roleType)" type="text" size="mini">
            加入黑名单
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
    <el-dialog
      title="拒绝原因"
      show-close
      :visible.sync="errorVisible"
      width="700px"
      class="menuLog"
      @open="dialogOpen"
      @close="dialogClose('dialogForm')"
    >
      <el-form :model="dialogForm" ref="dialogForm" label-width="150px" class="dialogForm">
        <el-form-item prop="reasonId" label="拒绝原因"
                      :rules='[{ required : true,message : "拒绝原因不能为空", trigger : "change" }]'>
          <el-radio-group v-model="dialogForm.reasonId" @change="()=>dialogForm.otherReason=''">
            <el-radio v-for="(item,index) in reasonList" :label="item.id"
                      :key="item.id">{{item.name}}
            </el-radio>
            <el-input class="width150 margin-left10" placeholder="请输入"
                      v-if="dialogForm.reasonId===999" key="8"
                      v-model="dialogForm.otherReason"></el-input>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="success" class="systemColor"
                           @click="confirm('dialogForm')">保 存</el-button>
                <el-button @click="errorVisible = false">关 闭</el-button>
            </span>
    </el-dialog>
  </el-card>
</template>

<script>


  export default {
    name: 'imageCheck',
    data() {
      return {
        baseActive: '0',
        dialogVisible: false,
        errorVisible: false,
        loading: false,
        list: [],
        dialogForm: {
          ids: [],
          reasonId: '',
          otherReason: ''
        },
        roleTypeList: [
          {
            id: 4,
            name: '个人'
          },
          {
            id: 5,
            name: '企业'
          },
        ],
        reasonList: [],
        ids: [],
        topicList: [],
        searchObj: {
          pageNo: 1,
          pageSize: 10,
          otherReason: '',
          daterange: [],
          startDate: '',
          endDate: '',
          publisher: '',
          roleType: '',
          status: '',
          topicId: '',
          type: 1,
          totalCount: 0,
        }
      };
    },
    created() {
      this.getList();
      this.getTopicList();
      this.getReason();
    },
    methods: {
      handleBlack(id, roleType,) {
        this.$confirm(`确定加入黑名单吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('blackJoin', {
              userId: id,
              status: false,
              roleType
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
      getTopicList() {
        this.$model('subjectList', {
          pageSize: 9999,
          pageNo: 1
        })
          .then((res) => {
            if (res.success) {
              this.topicList = res.data.records;
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      checkEvent(status, isAll, id = '') {
        if (status === 1) {
          let temp = [id];
          if (isAll) {
            if (this.ids.length === 0) {
              this.$message.error('请至少选一个内容');
              return;
            } else {
              temp = this.ids;
            }
          }
          this.$confirm(`确定通过该内容吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              this.status(temp, status);
            });
        } else {
          this.dialogForm.ids = [id];
          this.errorVisible = true;
        }
      },
      async confirm(formName) {
        const valid = await this.formValidate(formName);
        if (valid) {
          this.status(this.dialogForm.ids, -1, this.dialogForm.otherReason, this.dialogForm.reasonId);
        }
      },
      status(id, status, otherReason = '', reasonId = '') {
        this.$model('mediaCheck', {
          ids: id,
          status,
          otherReason,
          reasonId
        })
          .then((res) => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '操作成功!',
              });
              if (status === -1) {
                this.errorVisible = false;
              }
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      handleSelectionChange(val) {
        this.ids = val.map(item => item.id);
      },
      handleClick() {
        this.$resetSearchData();
        this.ids = [];
        this.getList();
      },
      joinHot(id, isHot) {
        this.$confirm(`确定${isHot ? '取消' : '加入'}热门吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model(isHot ? 'mediaCancelHot' : 'mediaJoinHot', {
              id
            })
              .then(res => {
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
        this.searchObj.status = parseInt(this.baseActive, 10);
        this.$model('mediaList', this.searchObj)
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
      getReason() {
        this.$model('getRejectReason')
          .then((res) => {
            if (res.success) {
              this.reasonList = res.data;
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      search() {
        this.searchObj.pageNo = 1;
        this.getList();
      },
      changeDate() {
        if (this.searchObj.daterange && this.searchObj.daterange.length > 1) {
          this.searchObj.startDate = this.searchObj.daterange[0]+ ' 00:00:00';
          this.searchObj.endDate = this.searchObj.daterange[1]+ ' 23:59:59';
        } else {
          this.searchObj.startDate = '';
          this.searchObj.endDate = '';
        }
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
  .image-check {
    height: 100%;

    .en-img {
      width: 86px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .img-tag {
      display: block;
      position: absolute;
      right: 20px;
      top: 55px;
      width: 30px;
      font-size: 12px;
      height: 16px;
      line-height: 16px;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
</style>

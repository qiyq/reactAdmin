<template>
  <el-card class="article-list listCard">
    <el-form :inline="true" class="searchForm" :model="searchObj" size="small">
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
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.keywords" placeholder="搜索标题关键字" clearable
                  prefix-icon="el-icon-search"
                  style="width:217px"></el-input>
      </el-form-item>
      <el-form-item class="form-search">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="danger" @click="$resetSearchData()">重置
        </el-button>
      </el-form-item>
      <el-form-item class="form-search pull-right">
        <el-button type="success" @click="add" class="systemColor margin-left10"
                   icon="el-icon-plus">新建文章
        </el-button>
      </el-form-item>
    </el-form>
    <el-table class="singer-table" v-loading="loading" element-loading-text="加载中..."
              height="calc(100% - 100px)"
              border :data="list">
      <el-table-column prop="createTime" label="编辑时间" align="center" width="220px">
        <template slot-scope="scope">
          <span>{{(scope.row.updateTime || scope.row.createTime) | dateFormat('yyyy-MM-dd hh:ss:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='title' label="标题" align="center"
                       :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop='weight' label="权重" width="150px" align="center">
      </el-table-column>
      <el-table-column prop='templateId' label="模板类型" align="center" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.templateId  | articleTemplateType(articleTemplateList)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="可见状态" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.isVisible ? '显示':'隐藏'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-button @click="visibleEvent(scope.row.id,scope.row.isVisible)" type="text"
                     size="mini">{{scope.row.isVisible ? '屏蔽' :'展示'}}
          </el-button>
          <el-button @click="deleteEvent(scope.row.id)" type="text" size="mini">删除</el-button>
          <el-button @click="edit(scope.row.id)" type="text" size="mini">编辑</el-button>
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
    name: 'article-list',
    data() {
      return {
        loading: false,
        list: [],
        articleTemplateList: [],
        searchObj: {
          type: 9,
          pageNo: 1,
          pageSize: 10,
          totalCount: 0,
          startTime: '',
          endTime: '',
          daterange: [],
          keywords: '',
        },
      };
    },
    created() {
      this.getTemplateList();
    },
    mounted() {
    },
    methods: {
      getTemplateList() {
        this.$model('articleTemplateList')
          .then((res) => {
            if (res.success) {
              this.articleTemplateList = res.data;
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      changeCity() {
        this.searchObj.areaCode = this.searchObj.city;
        this.searchObj.area = '';
        this.getCity(this.searchObj.city, false);
      },
      add() {
        this.$router.push({ name: 'articleAdd' });
      },
      edit(id) {
        this.$router.push({
          name: 'articleEdit',
          params: { id }
        });
      },
      changeDate() {
        if (this.searchObj.daterange && this.searchObj.daterange.length > 1) {
          this.searchObj.startTime = this.searchObj.daterange[0] + ' 00:00:00';
          this.searchObj.endTime = this.searchObj.daterange[1] + ' 23:59:59';
        } else {
          this.searchObj.startTime = '';
          this.searchObj.endTime = '';
        }
      },
      visibleEvent(id, isVisible) {
        this.$confirm(`确定${isVisible ? '屏蔽' : '展示'}该文章吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('articleVisible', {
              articleId: id,
              isVisible: !isVisible
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
      deleteEvent(id) {
        this.$confirm('确定删除该文章吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('articleDelete', {
              id
            })
              .then((res) => {
                if (res.success) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!',
                  });
                  this.getList();
                } else {
                  this.$message.error(res.msg);
                }
              });

          });
      },
      search() {
        this.searchObj.pageNo = 1;
        this.getList();
      },
      async confirm(formName) {
        const valid = await this.formValidate(formName);
        let temp = _.clone(this.dialogForm);
        temp.instSubId = temp.instSubId.join(',');
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '保存中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.5)'
          });
          this.$model('teacherSave', temp)
            .then(res => {
              this.$nextTick(() => {
                loading.close();
              });
              if (res.success) {
                this.$message.success('保存成功！');
                this.dialogVisible = false;
                this.getList();
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      },

      getList() {
        this.loading = true;
        this.$model('articleList', this.searchObj)
          .then((res) => {
            if (res.success) {
              this.list = res.data.records;
              console.log(this.list);
              this.searchObj.pageNo = res.data.current;
              this.searchObj.totalCount = res.data.total;
              this.loading = false;
            } else {
              this.$message.error(res.msg);
            }
          });
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
  .article-list {
    height: 100%;
  }
</style>

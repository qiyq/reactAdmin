<template>
  <el-card class="subject-check listCard">
    <el-tabs v-model="baseActive" type="card" @tab-click="handleClick">
      <el-tab-pane label="推荐位" name="1"></el-tab-pane>
      <el-tab-pane label="公开课" name="0"></el-tab-pane>
    </el-tabs>
    <el-form :inline="true" class="searchForm" :model="searchObj" size="small">
      <el-form-item>
        <el-select v-model="searchObj.subject" placeholder="请选择学科类别" class="select" clearable>
          <el-option v-for="(item,index) in courseList" :label="item.name" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.grade" placeholder="请选择使用年级" class="select" clearable>
          <el-option v-for="(item,index) in gradeList" :label="item.name" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.entrName" placeholder="请输入发布机构" clearable
                  prefix-icon="el-icon-search"
                  style="width:217px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="请输入课程标题" clearable
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
      <el-table-column prop='name' label="课程" align="center"
                       :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <el-button @click="selectVideo(scope.row.url)" type="text" size="mini">观看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="课程标题" align="center"
                       :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop="description" label="课程介绍" align="center">
        <template slot-scope="scope">
          <el-button @click="watchPage(scope.row.description)" type="text" size="mini">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop='entrName' label="发布机构" align="center"></el-table-column>
      <el-table-column prop='speaker' label="主讲人" align="center"></el-table-column>
      <el-table-column prop='subjectName' label="学科类别" align="center"></el-table-column>
      <el-table-column prop='gradeName' label="使用年级" align="center"></el-table-column>
      <el-table-column label="媒资大小（M）" align="center">
        <template slot-scope="scope">
          {{scope.row.size | diskDate}}
        </template>
      </el-table-column>
      <el-table-column prop='showNum' label="观看次数" align="center">
        <template slot-scope="scope">
          {{scope.row.showNum | returnZero}}
        </template>
      </el-table-column>
      <!--      <el-table-column label="推荐状态" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{scope.row.isRecommend ? '是' : '否'}}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="权重" align="center" prop="weight"></el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button @click="moveEvent(baseActive,scope.row.id)" type="text"
                     size="mini">{{baseActive === '1' ? '移除推荐位' :'加入推荐位'}}
          </el-button>
          <el-button @click="editWeight(scope.row.id)" type="text"
                     size="mini">编辑权重
          </el-button>
          <el-button v-if="baseActive === '0'" @click="deleteEvent(scope.row.id)"
                     type="text" size="mini">删除
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
      title="视频播放"
      show-close
      :visible.sync="dialogVisible"
      width="650px"
      class="agreeDialog"
      @open="dialogOpen"
    >
      <div class="dialog-content">
        <video-player
          class="video-player-box vjs-big-play-centered margin-top20"
          ref="videoPlayer"
          :options=" {
          muted: true,
          autoplay:true,
          width: 600,
          controls: true,
          height: 400,
          language: 'zh-CN',
          sources: [{
            type: 'video/mp4',
            src: selectUrl
          }],
          poster: '../../assets/imgs/head.jpg',
        }"
          :playsinline="true"
        >
        </video-player>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button size="mini"
                           @click="dialogVisible = false">关 闭</el-button>
            </span>
    </el-dialog>
    <el-dialog
      title="编辑权重"
      show-close
      :visible.sync="weightVisible"
      width="500px"
      class="agreeDialog"
      @open="dialogOpen"
      @close="dialogClose('weightModel')"
    >
      <div class="dialog-content">
        <el-form :model="weightModel" ref="weightModel" label-width="100px" class="dialogForm">
          <el-form-item prop="sort" label="权重"
                        :rules='[{ required : true,message : "权重不能为空", trigger : "blur" }]'>
            <el-input type="number" class="width300" v-model="weightModel.sort"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button type="success" class="systemColor"
                      size="mini" @click="confirm('weightModel')">保 存</el-button>
                <el-button size="mini"
                           @click="weightVisible = false">关 闭</el-button>
            </span>
    </el-dialog>
    <el-dialog
      title="课程介绍"
      show-close
      :visible.sync="errorVisible"
      width="700px"
      class="menuLog"
      @open="dialogOpen"
      @close="dialogClose('dialogForm')"
    >
      <div v-html="description"></div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="errorVisible = false">关 闭</el-button>
            </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import 'video.js/dist/video-js.css';
  import { videoPlayer } from 'vue-video-player';
  import 'video.js/dist/video-js.css';

  export default {
    name: 'courseList',
    components: {
      videoPlayer
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player;
      }
    },
    data() {
      return {
        baseActive: '1',
        dialogVisible: false,
        errorVisible: false,
        weightVisible: false,
        loading: false,
        list: [],
        weightModel: {
          recommendId: '',
          sort: ''
        },
        gradeList: [],
        courseList: [],
        selectUrl: '',
        description: '',
        searchObj: {
          pageNo: 1,
          pageSize: 10,
          entrName: '',
          isRecommend: '',
          name: '',
          grade: '',
          subject: '',
          totalCount: 0,
        }
      };
    },
    created() {
      this.getList();
      this.getGrade();
      this.getCourse();
    },
    methods: {
      watchPage(content) {
        this.description = content;
        this.errorVisible = true;
      },
      getGrade() {
        this.$model('getGrade')
          .then((res) => {
            if (res.success) {
              this.gradeList = res.data;
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      getCourse() {
        this.$model('getCourse')
          .then((res) => {
            if (res.success) {
              this.courseList = res.data;
            } else {
              this.$message.error(res.msg);
            }
          });
      },

      editWeight(id) {
        this.weightVisible = true;
        this.weightModel.courseId = id;
      },
      deleteEvent(id) {
        this.$confirm(`确定删除该课程吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('courseDel', {
              courseId: id,
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
      moveEvent(status, id = '') {

        this.$confirm(`确定${this.baseActive === '1' ? '移除' : '加入'}推荐位吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('courseRecommond', {
              courseId: id,
              type: this.baseActive === '1' ? 2 : 1
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
      async confirm(formName) {
        const valid = await this.formValidate(formName);
        if (valid) {
          this.$model('courseSort', this.weightModel)
            .then((res) => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '设置成功!',
                });
                this.weightVisible = false;
                this.getList();
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      },
      handleSelectionChange(val) {
        this.ids = val.map(item => item.id);
      },
      handleClick() {
        this.$resetSearchData();
        this.getList();
      },
      getList() {
        this.loading = true;
        this.searchObj.isRecommend = this.baseActive === '1';
        this.$model('courseList', this.searchObj)
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
      selectVideo(list) {
        if (!list) {
          this.$message.error('未上传视频，请上传!');
          return;
        }
        this.selectUrl = list;
        this.dialogVisible = true;
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
  .subject-check {
    height: 100%;
  }
</style>

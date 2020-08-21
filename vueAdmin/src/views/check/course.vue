<template>
  <el-card class="subject-check listCard">
    <el-tabs v-model="baseActive" type="card" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="0"></el-tab-pane>
      <el-tab-pane label="下架通知" name="2"></el-tab-pane>
    </el-tabs>
    <el-form :inline="true" class="searchForm" :model="searchObj" size="small">
      <el-form-item>
        <el-input v-model="searchObj.entrName" placeholder="请输入企业名称" clearable
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
      <el-table-column prop='instName' label="课程" align="center"
                       :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <el-button @click="selectVideo(scope.row.url)" type="text" size="mini">观看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="课程标题" align="center"
                       :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop="name" label="课程介绍" align="center">
        <template slot-scope="scope">
          <el-button @click="watchPage(scope.row.description)" type="text" size="mini">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop='entrName' label="发布机构" align="center"></el-table-column>
      <el-table-column prop='speaker' label="主讲人" align="center"></el-table-column>
      <el-table-column prop='subjectName' label="学科类别" align="center"></el-table-column>
      <el-table-column prop='gradeName' label="使用年级" align="center"></el-table-column>
      <el-table-column label="媒资大小（M）" align="center">showNum
        <template slot-scope="scope">
          {{scope.row.size | diskDate}}
        </template>
      </el-table-column>
      <template v-if="baseActive === '2'">
        <el-table-column label="观看次数" align="center">
          <template slot-scope="scope">
            {{scope.row.showNum | returnZero}}
          </template>
        </el-table-column>
        <el-table-column label="推荐状态" align="center">
          <template slot-scope="scope">
            {{scope.row.isRecommend ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column label="权重" align="center" prop="weight"></el-table-column>
      </template>

      <el-table-column label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-button @click="checkEvent(1,scope.row.id)" v-if="baseActive !== '2'" type="text"
                     size="mini">通过
          </el-button>
          <el-button @click="checkEvent(-1,scope.row.id)" v-if="baseActive !== '2'"
                     type="text" size="mini">拒绝
          </el-button>
          <el-button @click="offEvent(scope.row.id)" v-if="baseActive === '2'" type="text"
                     size="mini">下架通知
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

  export default {
    name: 'courseCheck',
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
        selectUrl: '',
        description: '',
        searchObj: {
          pageNo: 1,
          pageSize: 10,
          entrName: '',
          name: '',
          state: '',
          totalCount: 0,
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      watchPage(content) {
        this.description = content;
        this.errorVisible = true;
      },
      offEvent(id) {
        this.$confirm(`确定下架该内容吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('subjectOff', {
              id
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
      checkEvent(status, id = '') {
        this.$confirm(`确定${status === 1 ? '通过' : '拒绝'}该内容吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('subjectCheck', {
              id,
              status,
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
      handleClick() {
        this.$resetSearchData();
        this.getList();
      },
      getList() {
        this.loading = true;
        this.searchObj.state = parseInt(this.baseActive, 10);
        this.$model('subjectCheckList', this.searchObj)
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

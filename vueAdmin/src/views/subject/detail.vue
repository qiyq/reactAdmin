<template>
  <div class="subject-detail">
    <el-breadcrumb separator="|">
      <el-breadcrumb-item :to="{name:'subjectList'}"><i class="el-icon-back"></i>返 回
      </el-breadcrumb-item>
      <el-breadcrumb-item>专题列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="margin-top20 subject-detail-wrap">
      <el-tabs v-model="baseActive" type="card" @tab-click="handleClick">
        <el-tab-pane label="视频" name="0"></el-tab-pane>
        <el-tab-pane label="图片" name="1"></el-tab-pane>
      </el-tabs>
      <el-form :inline="true" class="searchForm" :model="searchObj" size="small">
        <el-form-item>
          <el-select v-model="searchObj.roleType" placeholder="发布人性质" class="select" clearable>
            <el-option v-for="(item,index) in roleTypeList" :label="item.name" :value="item.id"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchObj.daterange"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择发布日期"
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
      </el-form>
      <el-table class="singer-table" v-loading="loading" element-loading-text="加载中..."
                height="calc(100% - 150px)"
                border :data="list" @selection-change="handleSelectionChange">

        <el-table-column prop='instName' label="内容" align="center"
                         :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <el-button v-if="baseActive==='0'" @click="selectVideo(scope.row.url)" type="text"
                       size="mini">观看
            </el-button>
            <el-image v-if="baseActive==='1' && !loading"
                      :src="scope.row.url[0]"
                      class="en-img"
                      :preview-src-list="scope.row.url">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <span class="img-tag"
                  v-if="scope.row.url.length > 0 && baseActive==='1'">{{scope.row.url.length}}张</span>

          </template>
        </el-table-column>
        <el-table-column prop="title" v-if="baseActive === '0'" label="视频描述" align="center"
                         :show-overflow-tooltip='true'>
        </el-table-column>
        <el-table-column prop="title" v-if="baseActive === '1'" label="图片描述" align="center"
                         :show-overflow-tooltip='true'>
        </el-table-column>
        <el-table-column prop='entrName' label="所属企业" align="center"></el-table-column>
        <el-table-column prop='topicName' label="所属专题" align="center"
                         :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop='publisher' label="发布人" align="center">
        </el-table-column>
        <el-table-column prop='createTime' label="发布时间" align="center" width="235">
        </el-table-column>
        <el-table-column prop="weight" label="权重" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <template slot-scope="scope">
            <el-button @click="editWeight(scope.row.id,scope.row.topicId)" type="text" size="mini">
              编辑权重
            </el-button>
            <!--            <el-button @click="deleteEvent(scope.row.id)" type="text" size="mini">删除</el-button>-->
            <!--            <el-button @click="moveBlack(scope.row.id)" type="text" size="mini">移至黑名单</el-button>-->
            <el-button @click="cancelHot(scope.row.id,scope.row.isHot)" type="text" size="mini">
              {{scope.row.isHot ?
              '取消热门':'加入热门'}}
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
            <el-form-item prop="weight" label="权重"
                          :rules='[{ required : true,message : "权重不能为空", trigger : "blur" }]'>
              <el-input type="number" class="width300" v-model="weightModel.weight"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button type="success" class="systemColor" size="mini"
                      @click="confirm('weightModel')">保 存</el-button>
                <el-button size="mini"
                           @click="weightVisible = false">关 闭</el-button>
            </span>
      </el-dialog>
    </el-card>
  </div>

</template>

<script>
  import { videoPlayer } from 'vue-video-player';
  import 'video.js/dist/video-js.css';

  export default {
    name: 'subjectDetail',
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
        weightVisible: false,
        loading: false,
        errorVisible: false,
        list: [],
        selectUrl: '',
        exportObj: {
          pageNo: 1,
          pageSize: 10,
          instSubId: '',
          startDate: '',
          endDate: '',
          grades: [],
          exportType: 1,
          classesId: '',
        },
        ids: [],
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
        weightModel: {
          mediaId: '',
          topicId: '',
          weight: '',
        },
        searchObj: {
          pageNo: 1,
          pageSize: 10,
          status: 1,
          topicId: '',
          startDate: '',
          daterange: [],
          endDate: '',
          publisher: '',
          roleType: '',
          type: 0,
          totalCount: 0,
        }
      };
    },
    created() {
      this.getList();
      this.searchObj.topicId = parseInt(this.$route.params.id, 10) || '';
    },
    methods: {
      async confirm(formName) {
        const valid = await this.formValidate(formName);
        if (valid) {
          this.$model('subjectMediaWeight', this.weightModel)
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
      cancelHot(id, isHot) {
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
      editWeight(id, topicId) {
        this.weightVisible = true;
        this.weightModel.mediaId = id;
        this.weightModel.topicId = topicId;
      },
      deleteEvent(id) {
        this.$confirm('确定删除该内容吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('mediaDelete', { mediaId: id })
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
      selectVideo(list) {
        if (list.length === 0) {
          this.$message.error('未上传视频，请上传!');
          return;
        }
        this.selectUrl = list[0];
        this.dialogVisible = true;
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
      getList() {
        this.loading = true;
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
      changeDate() {
        if (this.searchObj.daterange && this.searchObj.daterange.length > 1) {
          this.searchObj.startDate = this.searchObj.daterange[0]+ ' 00:00:00';
          this.searchObj.endDate = this.searchObj.daterange[1] + ' 23:59:59';
        } else {
          this.searchObj.startDate = '';
          this.searchObj.endDate = '';
        }
      },
      handleClick() {
        this.searchObj.type = parseInt(this.baseActive, 10);
        this.getList();
      }
    }
  };
</script>

<style lang="less" scoped>
  .subject-detail {
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

    &-wrap {
      height: calc(~'100% - 40px');

      /deep/ .el-card__body {
        height: calc(~'100% - 40px');
      }
    }
  }
</style>

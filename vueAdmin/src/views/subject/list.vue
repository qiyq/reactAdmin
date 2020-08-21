<template>
  <el-card class="subject-list listCard">
    <el-form :inline="true" class="searchForm" size="small">
      <el-form-item class="form-search pull-right">
        <el-button type="success" @click="add" class="systemColor margin-left10"
                   icon="el-icon-plus">添加专题
        </el-button>
      </el-form-item>
    </el-form>
    <div class="subject-list-card">
      <div class="scrollDiv">
        <el-card v-for="(item,index) in list" :body-style="{ padding: '0px' }"
                 :key="'card' + index">
          <el-image style="width: 300px; height: 180px;cursor: pointer"
                    @click.native="gotoDetail(item.id)"
                    :src="item.coverImg"
                    :preview-src-list="[item.coverImg]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div style="padding: 14px;">
            <div class="clearfix">
              <p class="tip"><label for="">专题名称：</label><span class="ellipsis width200">{{item.title}}</span>
              </p>
              <p class="tip"><label for="">内容：</label><span
                class="ellipsis width200">{{item.desciption}}</span></p>
              <div class="multiTip">
                <p class="tip"><label for="">权重：</label><span>{{item.weight}}</span></p>

                <p class="tip"><label for="" class="margin-left10">评论数：</label><span>{{item.commentsNum}}</span>
                </p>
              </div>
              <div class="multiTip">
                <p class="tip"><label for="">观看量：</label><span>{{item.showNum}}</span></p>
                <p class="tip">
                  <label for="" class="margin-left10">点赞量：</label><span>{{item.likeNum}}</span>
                </p>
              </div>
              <p class="tip"><label for="">绑定企业：</label><span class="ellipsis width200">{{item.enterName}}</span>
              </p>
              <el-button type="text" class="button" @click="edit(item)">修改</el-button>
              <el-button type="text" @click="disabledEvent(item.id,item.disabled)"
                         class="button margin-right20">{{item.disabled ? '显示' :'隐藏'}}
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

    </div>

    <div class="pagination" v-show="list.length > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="searchObj.current"
        :page-sizes="[8, 10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="searchObj.pageSize"
        :total="searchObj.totalCount">
      </el-pagination>
    </div>
    <el-dialog
      :title="title"
      show-close
      :visible.sync="dialogVisible"
      width="700px"
      class="menuLog"
      @open="dialogOpen"
      @close="dialogClose('dialogForm')"
    >
      <el-form :model="dialogForm" ref="dialogForm" label-width="150px" class="dialogForm">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="title" label="专题名称"
                          :rules='[{ required : true,message : "专题名称不能为空", trigger : "blur" }]'>
              <el-input class="width300" placeholder="请输入"
                        v-model="dialogForm.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="coverImg" label="专题封面"
                          :rules='[{ required : true,message : "专题封面不能为空", trigger : "blur" }]'>
              <upload :url.sync="dialogForm.coverImg" item="coverImg" :key="key"
                      @validItem="validItem"
              ></upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="desciption" label="专题描述"
                          :rules='[{ required : true,message : "专题描述不能为空", trigger : "blur" }]'>
              <el-input type="textarea" class="width300" v-model="dialogForm.desciption"
                        :rows="5"  maxlength="140"
                        show-word-limit placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="weight" label="权重">
              <el-input type="number" class="width300" v-model="dialogForm.weight"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="entrId" label="绑定企业ID">
              <el-input class="width150" v-model="dialogForm.entrId"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="certificateNo" label="" label-width="0">
              <el-button type="text" @click="getEntrName">查询</el-button>
              <span class="margin-left10">{{entrName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="disabled" label="专题状态"
                          :rules='[{ required : true,message : "专题状态不能为空", trigger : "change" }]'>
              <el-radio-group v-model="dialogForm.disabled">
                <el-radio :label="true">隐藏</el-radio>
                <el-radio :label="false">显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="success" class="systemColor"
                           @click="confirm('dialogForm')">保 存</el-button>
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: 'subjectList',
    data() {
      return {
        title: '添加专题',
        dialogVisible: false,
        key: 1,
        dialogForm: {
          id: '',
          coverImg: '',
          desciption: '',
          disabled: true,
          title: '',
          weight: '',
          entrId: '',
        },
        loading: false,
        entrName: '',
        list: [],
        searchObj: {
          pageNo: 1,
          pageSize: 8,
          totalCount: 0,
        },
      };
    },
    created() {
      this.getList();
    },
    mounted() {
      this.scroll = new this.$scroll('.scrollDiv');
    },
    methods: {
      getEntrName() {
        if (!this.dialogForm.entrId) {
          this.$message.error('请输入绑定企业Id');
          return;
        }
        this.$model('entrById', {
          entrId: this.dialogForm.entrId,
        })
          .then((res) => {
            if (res.success) {
              this.entrName = res.data || '';
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      gotoDetail(id) {
        this.$router.push({
          name: 'subjectDetail',
          params: { id }
        });
      },
      disabledEvent(id, status) {
        this.$confirm(`确定${status ? '显示' : '隐藏'}该专题吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('subjectStatus', {
              id: id,
              disabled: !status
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

      validItem(item) {
        this.$refs.dialogForm.clearValidate([item]);
      },
      async confirm(formName) {
        const valid = await this.formValidate(formName);
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '保存中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.5)'
          });
          this.$model('subjectSave', this.dialogForm)
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
      add() {
        this.title = '添加专题';
        ++this.key;
        this.dialogVisible = true;
      },
      edit(row) {
        console.log(row);
        ++this.key;
        this.title = '编辑专题';
        this.dialogVisible = true;
        this.$simpleAssign(this.dialogForm, row);
      },
      getList() {
        this.loading = true;
        this.$model('subjectList', this.searchObj)
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
  .subject-list {
    height: 100%;

    &-card {
      position: relative;
      height: calc(~'100% - 90px');

      .scrollDiv {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        position: relative;
      }

      .el-card {
        margin-top: 20px;
        margin-right: 50px;
        height: 330px;
        width: 300px;

        .ellipsis {
          vertical-align: bottom;
        }

        .el-image {
          display: flex;
          justify-content: center;
          align-items: center;

          i {
            font-size: 30px;
          }
        }

        .multiTip {
          display: flex;

          .tip {
            width: 50%;

            span {
              width: 70px;
            }
          }
        }

        .tip {
          font-size: 13px;
          margin-top: 5px;

          label {
            display: inline-block;
            width: 70px;
            text-align: right;
          }

          span {
            color: #999;
          }
        }

        .button {
          padding: 0;
          float: right;
        }
      }
    }
  }
</style>

<template>
  <div class="article-add">
    <el-breadcrumb separator="|">
      <el-breadcrumb-item :to="{name:'articleList'}"><i class="el-icon-back"></i>返 回
      </el-breadcrumb-item>
      <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="margin-top20 article-add-wrap">
      <el-form :model="dialogForm" ref="dialogForm" label-width="150px" class="dialogForm">
        <el-form-item prop="templateId" label="模板类型"
                      :rules='[{ required : true,message : "模板类型不能为空", trigger : "change" }]'>
          <el-select v-model="dialogForm.templateId" placeholder="请选择模板类型" class="width300"
                     @change="changeCover"
                     clearable>
            <el-option v-for="(item,index) in articleTemplateList" :label="item.name"
                       :value="item.id"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="banner" label="上传封面" v-if="coverCount"
                      :rules='[{ required : true,message : "上传封面不能为空", trigger : "blur" }]'>
          <el-upload
            ref="upload"
            :limit="coverCount"
            :action="action"
            list-type="picture-card"
            :file-list="fileList"
            :auto-upload="true"
            :multiple="true"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            accept="image/*">
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="title" label="文章标题"
                      :rules='[{ required : true,message : "文章标题不能为空", trigger : "blur" }]'>
          <el-input class="width300" placeholder="请输入文章标题"
                    v-model="dialogForm.title"></el-input>
        </el-form-item>
        <el-form-item prop="weight" label="文章权重"
                      :rules='[{ required : true,message : "文章权重不能为空", trigger : "blur" },
                      { type: "number", message: "权重必须为数字值"},{ pattern:/^\d{1,3}$/, message: "权重小余999"}]'>
          <el-input type="text" class="width300" placeholder="请输入文章权重"
                    v-model.number="dialogForm.weight"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="文章内容"
                      :rules='[{ required : true,message : "文章内容不能为空", trigger : "blur" }]'>
          <div ref="editor" class="editor"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="systemColor" @click="confirm('dialogForm')">保 存
          </el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
  import Wangeditor from 'wangeditor';

  export default {
    name: 'articleAdd',
    data() {
      return {
        fileList: [],
        action: this.$baseURL + '/common/uploadFile',
        actions: this.$baseURL + '/common/batchUpload',
        id: parseInt(this.$route.params.id, 10) || '',
        dialogForm: {
          articleTypeId: '',
          attachment: '',
          banner: '',
          content: '',
          templateId: '',
          id: '',
          title: '',
          weight: '',
        },
        imgPre: '',
        editor: null,
        articleTemplateList: [],
        coverCount: 0,
      };
    },
    mounted() {
      this.scroll = window.screen.width <= 1366 ? new this.$scroll('.dialogForm') : null;
      this.editor = new Wangeditor(this.$refs.editor);
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        // 'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        // 'video',  // 插入视频
        // 'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ];
      this.editor.customConfig.showLinkImg = false;
      this.editor.customConfig.uploadImgServer = this.actions;
      this.editor.customConfig.uploadFileName = 'files';
      this.editor.customConfig.uploadImgMaxLength = 5;
      this.editor.customConfig.onchange = (html) => {
        if (!this.dialogForm.content && html) {
          this.validItem('content');
        }
        this.dialogForm.content = html;
      };

      this.editor.customConfig.customAlert = function (info) {
        // info 是需要提示的内容
        console.log('自定义提示：' + info);
      };
      this.editor.customConfig.uploadImgHooks = {
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // console.log(result);
        },
        customInsert: function (insertImg, result, editor) {
          let temp = result.data.pathsMap;
          temp.forEach(item => {
            insertImg(result.data.prefix + item.saveUrl);
          });
        }
      };

      this.editor.create();
    },
    created() {
      this.imgPre = sessionStorage.getItem('imgPre');
      this.getList();

    },
    methods: {
      async confirm(formName) {
        if (this.fileList.length > 0) {
          this.dialogForm.banner = this.fileList.map(item => {
            if (item.hasOwnProperty('response')) {
              return item.response.data.downloadPath;
            } else {
              return item.shortUrl;
            }
          })
            .join(',');
        } else {
          this.dialogForm.banner = '';
        }
        const valid = await this.formValidate(formName);
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '保存中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.5)'
          });
          this.$model('articleAdd', this.dialogForm)
            .then(res => {
              this.$nextTick(() => {
                loading.close();
              });
              if (res.success) {
                this.$message.success('保存成功！');
                this.$router.push({ name: 'articleList' });
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      },
      validItem(item) {
        this.$refs.dialogForm.clearValidate([item]);
      },
      handleRemove(file, fileList) {
        this.fileList = fileList || [];
      },
      handleAvatarSuccess(res, file, fileList) {
        if (res.success) {
          this.$message.success('上传成功！');
          this.fileList = fileList;
          this.validItem('banner');
        }
      },
      getList() {
        this.$model('articleTemplateList')
          .then((res) => {
            if (res.success) {
              this.articleTemplateList = res.data || [];
              this.getInfo();
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      getInfo() {
        if (!this.id) return;
        this.$model('articleInfo', { id: this.id })
          .then((res) => {
            if (res.success) {
              this.$simpleAssign(this.dialogForm, res.data);
              this.changeCover();
              this.editor.txt.html(this.dialogForm.content);
              this.fileList = this.dialogForm.banner.split(',')
                .map(item => {
                  return {
                    url: this.imgPre + item,
                    shortUrl: item
                  };
                });
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      changeCover() {
        if (this.articleTemplateList.length === 0 || !this.dialogForm.templateId) return;
        this.coverCount = this.articleTemplateList.filter(item => item.id === this.dialogForm.templateId)[0].coverCount;
      }
    }
  };
</script>

<style lang="less" scoped>
  .article-add {
    height: 100%;

    /deep/.el-upload-list__item-status-label {
      display: none;
    }

    /deep/ .el-upload--picture-card, /deep/ .el-upload-list__item {
      height: 100px;
      line-height: 100px;
      width: 100px;
    }

    &-wrap {
      height: calc(~'100% - 40px');

      /deep/ .el-card__body {
        position: relative;
        height: 100%;

        .dialogForm {
          height: 100%
        }
      }

      .editor {
        text-align: left;
      }
    }
  }
</style>

<template>
  <div class="upload">
    <el-upload
      :disabled='disabled'
      :limit="limit"
      :action="action"
      :auto-upload="true"
      :accept="accept"
      :show-file-list="false"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :on-change="uploadChange"
      :before-upload="beforeAvatarUpload">
      <img v-if="url && !dialogImageUrl" :src="(url.indexOf('http') > -1) ? url : imgPre + url" class="logoImage">
      <img v-if="dialogImageUrl" :src="dialogImageUrl" class="logoImage">
      <div v-if="!url" class="iconPlus" :style="{width: width}">
        <i class="el-icon-plus"></i>
      </div>
    </el-upload>
  </div>
</template>

<script>
  export default {
    name: 'upload',
    props: {
      width: {
        type: String,
        default: '100px'
      },
      item: {
        type: String,
      },
      accept: {
        type: String,
        default: 'image/*'
      },
      url: {
        type: String,
      },
      disabled: {
        type: Boolean,
        default: false
      },

      limit: {
        type: Number,
        default: 666
      }
    },
    data() {
      return {
        imgPre: '',
        action: this.$baseURL + '/common/uploadFile',
        dialogImageUrl: '',
      };
    },
    created() {
      this.imgPre = sessionStorage.getItem('imgPre');
      if (!this.imgPre) {
        this.getImgPre();
      }
    },
    methods: {
      getImgPre() {
        this.$model('imgPre')
          .then((res) => {
            if (res.success) {
              this.imgPre = res.data;
              sessionStorage.setItem('imgPre', res.data);
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      uploadChange(file, fileList) {
        // console.log(fileList);
      },
      handleRemove(file, fileList) {
        this.$emit('update:url', '');
      },
      handleAvatarSuccess(res, file) {
        if (res.success) {
          this.$message.success('上传成功！');
          this.$emit('update:url', res.data.downloadPath);
          this.dialogImageUrl = res.data.prefix + res.data.downloadPath;
          if (this.item) {
            this.$emit('validItem', this.item);
          }
        }
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;
        //
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
      }
    }
  };
</script>

<style lang="less">
  .iconPlus {
    height: 100px;
    line-height: 100px;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    cursor: pointer;
    vertical-align: top;
  }

  .logoImage {
    width: 97px;
    height: 97px;
  }
</style>

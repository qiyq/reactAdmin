<template>
  <div class="upload">
    <div class="imgList ">
      <div v-if="fileList.length >0"
           v-for="(item,index) in fileList" :key="index"
           class=" el-upload-list--picture-card " :class="{'margin-left10':index > 0}"
      >
        <img class="img" :src="item.url" alt="">
        <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-delete"
          @click="handleRemove(index)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
      </div>
    </div>
    <el-upload
      :action="action"
      :disabled='disabled '
      :show-file-list="false"
      :auto-upload="true"
      class="multi-upload "
      :accept="accept"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <div class="el-upload--picture-card" v-if="fileList.length < limit" >
        <i class="el-icon-plus "></i>
      </div>
      <div slot="tip" class="el-upload__tip colorF0B928" v-if="fileList.length < limit">图片最多不超过6张
      </div>
    </el-upload>
  </div>
</template>

<script>
  export default {
    name: 'multiUpload',
    props: {
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
        default: 6
      },
    },
    data() {
      return {
        imgPre: '',
        action: this.$baseURL + '/common/uploadFile',
        dialogImageUrl: '',
        fileList: []
      };
    },
    mounted() {
      let arr = this.url ? this.url.split(',') : [];
      this.fileList = arr.map(item => {
        return {
          name: item,
          url: this.imgPre + item,
          path: item
        };
      });
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
      handleRemove(index) {
        this.fileList.splice(index, 1);
        this.$emit('update:url', this.fileList.map(item => item.path)
          .join(','));
      },
      handleAvatarSuccess(res, file) {
        if (res.success) {
          this.$message.success('上传成功！');
          this.fileList.push({
            name: file.name,
            url: res.data.prefix + res.data.downloadPath,
            path: res.data.downloadPath
          });
          this.$emit('update:url', this.fileList.map(item => item.path)
            .join(','));
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

<style lang="less" scoped>
  .el-upload-list__item, .el-upload--picture-card {
    height: 100px !important;
    width: 100px !important;
    line-height: 100px !important;
  }

  .multi-upload {
    margin-left: 10px;
  }

  .upload {
    display: flex;

    .imgList {
      display: flex;
      cursor: pointer;

      & > div {
        position: relative;
      }


      .el-upload-list__item-actions {
        width: 100px;
        height: 100px;
        border-radius: 6px;
      }

      .img {
        border-radius: 6px;
        width: 100px;
        height: 100px;
      }
    }
  }

  .logoImage {
    width: 97px;
    height: 97px;
  }
</style>

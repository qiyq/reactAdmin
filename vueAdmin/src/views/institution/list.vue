<template>
  <el-card class="institution-list listCard">
    <el-form :inline="true" class="searchForm" :model="searchObj" size="small">
      <el-form-item>
        <el-select v-model="searchObj.city" placeholder="请选择市州" class="select" clearable
                   @change="changeCity">
          <el-option v-for="(item,index) in cityList" :label="item.name" :value="item.code"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.area" placeholder="请选择区县" class="select" clearable
                   @change="changeArea">
          <el-option v-for="(item,index) in areaList" :label="item.name" :value="item.code"
                     :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.state" placeholder="请选择用户类型" class="select" clearable>
          <el-option label="免费用户" :value="0"></el-option>
          <el-option label="付费用户" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.daterange"
          type="daterange"
          @change="changeDate"
          format="yyyy-MM-dd"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.entrName" placeholder="请输入企业名称" clearable
                  prefix-icon="el-icon-search"
                  style="width:217px"></el-input>
      </el-form-item>
      <el-form-item class="form-search">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="danger" @click="$resetSearchData()">重置
        </el-button>
      </el-form-item>
      <el-form-item class="form-search pull-right">
        <el-button type="success" class="systemColor" @click="exportEvent">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table class="singer-table" v-loading="loading" element-loading-text="加载中..."
              height="calc(100% - 100px)"
              border :data="list">
      <el-table-column prop="areaName" label="区域" align="center" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop="entrId" label="企业ID" align="center" width="100px"></el-table-column>
      <el-table-column prop='name' label="企业名称" align="center"
                       :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop='imgList' label="使用空间（M）" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.used | diskDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='fileList' label="空间上限（M）" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.total | diskDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='imgList' label="用户类型" align="center" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.state === 0 ? '免费' :'付费'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.expireTime | dateFormat('yyyy-MM-dd hh:ss:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="套餐包类型" align="center">
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column prop="concat" label="联系方式" align="center" width="150px">
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-button @click="buy(scope.row.id)" type="text" size="mini">购买</el-button>
          <!--          <el-button @click="refuse(scope.row.id)" type="text" size="mini">退费</el-button>-->
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
      title="套餐包选购"
      show-close
      :visible.sync="dialogVisible"
      width="1000px"
      class="menuLog"
      @open="dialogOpen"
      @close="close()"
    >

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
    name: 'institutionList',
    data() {
      return {
        dialogVisible: false,
        dialogForm: {
          id: '',
          content: '',
          certificateNo: '',
          certificateImg: '',
          internationalPermitImg: '',
          otherPermitImg: '',
          workPermitImg: '',
          phone: '',
          foreignNationality: false,
          fullTime: '',
          degree: '',
          idcard: '',
          socialInsurance: '',
          description: '',
          instSubId: [],
          insubName: '',
          name: '',
          photo: '',
          sex: '',
          sexName: '',
        },
        trainList: [],
        trainListId: [],
        cityList: [],
        areaList: [],
        degreeList: [],
        loading: false,
        list: [],
        searchObj: {
          pageNo: 1,
          pageSize: 10,
          city: '',
          area: '',
          entrId: '',
          entrName: '',
          state: '',
          totalCount: 0,
          startTime: '',
          endTime: '',
          daterange: [],
          areaCode: '',
        },
        exportObj: {
          pageNo: 1,
          pageSize: 10,
          instSubId: '',
          startDate: '',
          endDate: '',
          grades: [],
          exportType: 2,
          classesId: '',
        },
      };
    },
    created() {
      this.getList();
      this.getCity('51');//获取城市列表
    },
    mounted() {
    },
    methods: {
      changeCity() {
        this.searchObj.areaCode = this.searchObj.city;
        this.searchObj.area = '';
        this.getCity(this.searchObj.city, false);
      },
      changeArea() {
        this.searchObj.areaCode = this.searchObj.area;
      },
      exportEvent() {

      },
      changeDate() {
        if (this.searchObj.daterange && this.searchObj.daterange.length > 1) {
          this.searchObj.startTime = this.searchObj.daterange[0]+ ' 00:00:00';
          this.searchObj.endTime = this.searchObj.daterange[1] + ' 23:59:59';
        } else {
          this.searchObj.startTime = '';
          this.searchObj.endTime = '';
        }
      },
      refuse(id) {
        this.$confirm('确定办理该企业退费吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$model('teacherDelete', {
              id: id,
              instSubId: parseInt(inSubId, 10)
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
      getCity(code, isCity = true) {
        this.$model('cityData', { pcode: code })
          .then((res) => {
            if (isCity) {
              this.cityList = res;
            } else {
              this.areaList = res;
            }
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
      buy() {
        this.dialogVisible = true;
      },
      getList() {
        this.loading = true;
        this.$model('entrList', this.searchObj)
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
  .institution-list {
    height: 100%;
  }
</style>

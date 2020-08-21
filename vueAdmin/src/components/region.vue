<template>
  <div class="region" :style="{width:width+'px'}">
    <el-select v-model="provinceId" class="provinceId" placeholder="省份" @click="selectProvince(provinceId)"
               disabled>
      <el-option v-for="province in provinceList" :label="province.name" :key="province.code"
                 :value="province.code"></el-option>
    </el-select>
    <el-select class="city" placeholder="城市" v-model="cityId" @change="selectCity(cityId)" :disabled="disabled">
      <el-option v-for="city in cityList" :label="city.name" :key="city.code" :value="city.code"></el-option>
    </el-select>
    <el-select class="area" placeholder="县区" v-model="areaId" @change="selectArea(areaId)" :disabled="disabled">
      <el-option v-for="area in areaList" :label="area.name" :key="area.code" :value="area.code"></el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'region',
    props: {
      width: {
        type: Number,
        default: 400
      },
      province: {
        type: String,
        default: '51',
      },
      disabled: {
        type: Boolean
      },
      city: {
        type: String
      },
      area: {
        type: String
      }
    },
    data() {
      return {
        provinceId: this.province || '',
        cityId: this.city || '',
        areaId: this.area || '',
        provinceList: [],
        areaList: [],
        cityList: []
      };
    },
    created() {
      this.getCity('', 1);
      this.getCity('51', 2);
      if (this.city) {
        this.getCity(this.city, 3);
      }

    },

    methods: {
      selectProvince(val) {
        this.$emit('update:province', val);
        this.cityId = '';
        this.areaId = '';
        this.$emit('update:city', '');
        this.$emit('update:area', '');
        this.getCity(val, 2);
      },
      selectCity(val) {
        this.$emit('update:city', val);
        this.areaId = '';
        this.$emit('update:area', '');
        this.getCity(val, 3);
      },
      selectArea(val) {
        this.$emit('update:area', val);
        // let region = this.provinceList.filter(item => item.code === this.provinceId)[0].name + this.cityList.filter(item => item.code === this.cityId)[0].name + this.areaList.filter(item => item.code === this.areaId)[0].name;
        // this.$emit('update:region', region);
      },
      getCity(code, key) {
        this.$model('cityData', { pcode: code })
          .then((res) => {
            if (key === 1) {
              this.provinceList = res;
              this.provinceId = '51';//默认四川
            } else if (key === 2) {
              this.cityList = res;
            } else {
              this.areaList = res;
            }
          });
      }
    }
  };
</script>

<style lang="less">
  .region {
    display: flex;

    .city {
      margin: 0 5px;
    }
  }

</style>

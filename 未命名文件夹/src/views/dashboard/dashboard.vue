<template>
  <div class="dashboard"
    style="width: 100%;overflow-y: auto; box-sizing: border-box;padding: 20px;background-color: #E9EEF3;">
    <div style="width: 100%;overflow: hidden;margin-bottom: 50px;">
      <div class="survey">
        <div class="quantity box">
          <div class="iconbox">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="quantity_goods">
            <span class="txt">商品数量</span>
            <span class="num">21</span>
          </div>
        </div>
        <div class="manifest box">
          <div class="iconbox">
            <i class="el-icon-chat-dot-square"></i>
          </div>
          <div class="quantity_goods">
            <span class="txt">未发货单</span>
            <span class="num">315</span>
          </div>
        </div>
      </div>
      <div ref="orders" style="width: 748px;height: 350px;float: left;margin-left: 100px;margin-top: 40px;">
      </div>
    </div>
    <!-- <div ref="amount" style="width: 470px;height: 400px;margin-left: 30px;float: left;"></div> -->
    <div ref="region" style="width: 231px;height: 400px;float: left;margin-left: 50px;"></div>
    <!-- <div ref="channel" style="width: 231px;height: 400px;float: left;margin-left: 50px;"></div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      shuJu: null,
      goodsCount: 0,
      waitStockCount: 0
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      // const myChart = this.$echarts.init(this.$refs.orders)
      // const amount = this.$echarts.init(this.$refs.amount)
      // const channel = this.$echarts.init(this.$refs.channel)

      const that = this
      const token = window.sessionStorage.getItem('token')
      this.axios.get('http://192.168.1.54:8081/m.api', {
        headers: {
          ADMINTOKEN: token
        },
        params: {
          _gp: 'admin.dashboard',
          _mt: 'integral'
        }
      }).then(function (reds) {
        const region = that.$echarts.init(that.$refs.region)

        const option3 = {
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: reds.data.data.area,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        }

        region.setOption(option3)
      })
      // 绘制图表
      // myChart.setOption(option)
      // amount.setOption(option2)
      // channel.setOption(option4)
      // const region = this.$echarts.init(this.$refs.region)
      // const option3 = {
      //   series: [{
      //     name: '访问来源',
      //     type: 'pie',
      //     radius: '50%',
      //     data: [{
      //       key: '重庆',
      //       name: '重庆',
      //       value: 94
      //     }, {
      //       key: '浙江省',
      //       name: '浙江省',
      //       value: 19
      //     }, {
      //       key: '北京',
      //       name: '北京',
      //       value: 36
      //     }, {
      //       key: '山东省',
      //       name: '山东省',
      //       value: 1
      //     }, {
      //       key: '广东省',
      //       name: '广东省',
      //       value: 114
      //     }, {
      //       key: '河北省',
      //       name: '河北省',
      //       value: 51
      //     }, {
      //       key: '江西省',
      //       name: '江西省',
      //       value: 2
      //     }, {
      //       key: '内蒙古自治区',
      //       name: '内蒙古自治区',
      //       value: 30
      //     }, {
      //       key: '北京市',
      //       name: '北京市',
      //       value: 217
      //     }, {
      //       key: '天津',
      //       name: '天津',
      //       value: 32
      //     }, {
      //       key: '宁夏回族自治区',
      //       name: '宁夏回族自治区',
      //       value: 14
      //     }, {
      //       key: '山西省',
      //       name: '山西省',
      //       value: 52
      //     }, {
      //       key: '天津市',
      //       name: '天津市',
      //       value: 24
      //     }, {
      //       key: '湖南',
      //       name: '湖南',
      //       value: 6
      //     }, {
      //       key: '湖南省',
      //       name: '湖南省',
      //       value: 21
      //     }],
      //     emphasis: {
      //       itemStyle: {
      //         shadowBlur: 10,
      //         shadowOffsetX: 0,
      //         shadowColor: 'rgba(0, 0, 0, 0.5)'
      //       }
      //     }
      //   }]
      // }
      // region.setOption(option3)
    }
  },
  beforeCreate () {

  }
}
</script>

<style>
  .survey {
    width: 235px;
    height: 280px;
    position: relative;
    float: left;
    margin-top: 18px;
    margin-left: 30px;
  }

  .survey .box {
    width: 100%;
    height: 108px;
    background-color: white;
    cursor: pointer;
    position: absolute;
  }

  .survey .quantity {
    top: 0;
  }

  .survey .manifest {
    bottom: 0;
  }

  .survey .box .iconbox {
    width: 80px;
    height: 80px;
    /* background-color: #40c9c6; */
    border-radius: 6px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
    text-align: center;
    line-height: 80px;
    font-size: 48px;
    transition: 0.5s;
  }

  .survey .quantity.box .iconbox {
    color: #40c9c6;
  }

  .survey .manifest.box .iconbox {
    color: #36a3f7;
  }

  .survey .quantity.box:hover .iconbox {
    color: white;
    background-color: #40c9c6;
  }

  .survey .manifest.box:hover .iconbox {
    color: white;
    background-color: #36a3f7;
  }

  .survey .box .quantity_goods {
    width: 64px;
    height: 56px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 25px;
    text-align: left;
    font-weight: 600;
    font-size: 16px;
  }

  .survey .box .quantity_goods .txt {
    color: #8C8C8C;
  }

  .survey .box .quantity_goods .num {
    display: inline-block;
    margin-top: 12px;
    color: #666666;
  }
</style>

<template>
  <div class="dashboard"
    style="width: 100%;overflow-y: auto; box-sizing: border-box;padding: 20px;background-color: #E9EEF3;">
    <div style="width: 100%;overflow: hidden;margin-bottom: 50px;">
      <div class="survey" style="float: left;">
        <div class="quantity box">
          <div class="iconbox">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="quantity_goods">
            <span class="txt">商品数量</span>
            <span>{{goodsCount}}</span>
          </div>
        </div>
        <div class="manifest box">
          <div class="iconbox">
            <i class="el-icon-chat-dot-square"></i>
          </div>
          <div class="quantity_goods">
            <span class="txt">未发货单</span>
            <span>{{waitStockCount}}</span>
          </div>
        </div>
      </div>
      <div ref="orderChart" style="width: 748px;height: 350px;float: left;margin-top: 40px;">
      </div>
    </div>
    <div ref="amount" style="width: 470px;height: 400px;margin-left: 30px;float: left;"></div>
    <div ref="region" style="width: 231px;height: 400px;float: left;margin-left: 50px;"></div>
    <div ref="order" style="width: 231px;height: 400px;float: left;margin-left: 50px;"></div>
  </div>
</template>

<script>
import { listRole } from '../../api/dashboard.js'
export default {
  data () {
    return {
      goodsCount: 0, // 商品数量
      waitStockCount: 0 // 未发货单
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例

      const that = this
      listRole().then(function (reds) {
        that.waitStockCount = reds.data.data.waitStockCount
        that.goodsCount = reds.data.data.goodsCount
        // 创建容器
        const orderChart = that.$echarts.init(that.$refs.orderChart)
        const region = that.$echarts.init(that.$refs.region)
        const sumChart = that.$echarts.init(that.$refs.amount)
        const channelChart = that.$echarts.init(that.$refs.order)
        // 生产数据
        const option1 = {
          title: { text: '7日订单' },
          legend: {
            data: ['订单数'],
            right: 1
          },
          yAxis: [
            {
              name: '订单数',
              type: 'value',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                color: '#666',
                fontSize: 12
              }
            }
          ],
          xAxis: {
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              margin: 12
            },
            data: reds.data.data.daysOrder[0]
          },
          series: [
            {
              name: '订单数',
              yAxisIndex: 0,
              data: [820, 932, 901, 934, 1290, 1330, 1320], // response.data.data.daysOrder[1],
              type: 'bar',
              color: '#00B5FF',
              barWidth: 30
            }
          ]
        }
        const option2 = {
          title: { text: '7日成交金额' },
          legend: {
            data: ['订单数'],
            right: 1
          },
          yAxis: [
            {
              name: '订单数',
              type: 'value',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                color: '#666',
                fontSize: 12
              }
            }
          ],
          xAxis: {
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              margin: 12
            },
            data: reds.data.data.daysSum[0]
          },
          series: [
            {
              name: '订单数',
              yAxisIndex: 0,
              data: [820, 932, 901, 934, 1290, 1330, 1320], // response.data.data.daysSum[1],
              type: 'line',
              color: '#20B2AA'
            }
          ]
        }
        const option3 = {
          title: { text: '订单地区分布' },
          legend: {
            data: ['地区分布'],
            right: 1,
            color: '#20B2AA'
          },
          series: [
            {
              type: 'pie',
              name: '地区分布',
              data: reds.data.data.area
            }
          ]
        }
        const option4 = {
          title: { text: '订单渠道分布' },
          legend: {
            data: ['渠道分布'],
            right: 1,
            color: '#20B2AA'
          },
          series: [
            {
              type: 'pie',
              name: '地区分布',
              data: reds.data.data.channel,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        // 渲染数据
        orderChart.setOption(option1)
        sumChart.setOption(option2)
        region.setOption(option3)
        channelChart.setOption(option4)
      })
    }
  }
}
</script>

<style>
  .survey {
    width: 235px;
    height: 280px;
    position: relative;
    float: left;
    margin-top: 48px;
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

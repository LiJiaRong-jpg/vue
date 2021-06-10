<template>
  <div>
    <div>
      <div style="width: 100%;height: 60px;"></div>
      <el-input v-model="form.orderNo" clearable class="filter-item" style="width: 200px;margin: 0 10px;"
        placeholder="请输入订单编号" />
      <el-select v-model="form.status" style="width: 200px;margin: 0 10px;" class="filter-item" placeholder="请选择订单状态">
        <el-option v-for="(key, value) in status" :key="key" :label="key" :value="value" />
      </el-select>
      <el-button type="primary" style="position: absolute;" icon="el-icon-search" @click="load">查找</el-button>

      <br />
      <el-date-picker v-model="downData.gmtStart" type="datetime" style="width: 200px" class="filter-item"
        default-time="00:00:00" placeholder="选择开始日期" />
      <span>至</span>
      <el-date-picker v-model="downData.gmtEnd" type="datetime" style="width: 200px" class="filter-item"
        default-time="00:00:00" placeholder="选择结束日期" />
      <el-select v-model="downData.status" style="width: 200px" class="filter-item" placeholder="待出库">
        <el-option v-for="(key, value) in status" :key="key" :label="key" :value="value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-download"
        @click="deliveryOrder">导出</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download"
       >汇总</el-button>
    </div>

    <div style="width: 95%;margin: auto;">
      <el-table :data="tableData.items" size="small" border fit highlight-current-row>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="right" class="table-expand">
              <el-form-item label="联系人">
                <span>{{ props.row.consignee }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="right" class="table-expand">
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="right" class="table-expand">
              <el-form-item label="客服备注">
                <span>{{props.row.adminMono ? props.row.adminMono : "无"}}</span>
              </el-form-item>
            </el-form>
            <el-form v-if="props.row.status === 60 || props.row.refundReason" label-position="right"
              class="table-expand">
              <el-form-item label="退款原因">
                <span>{{props.row.refundReason? props.row.refundReason: "未填写退款原因"}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column align="center" width="180" label="订单编号" prop="orderNo" />

        <el-table-column align="center" width="80" label="用户ID" prop="userId" />

        <el-table-column align="center" width="120" label="订单状态" prop="status">
          <template slot-scope="scope">
            <el-tag>{{status[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" width="110" label="支付渠道" prop="payChannel">
          <template slot-scope="scope">
            <el-tag>{{ payment[scope.row.payChannel]}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" label="订单金额" prop="actualPrice">
          <template slot-scope="scope">
            <span>¥ {{ scope.row.actualPrice / 100.0 }}</span>
          </template>
        </el-table-column>

        <!--<el-table-column align="center" label="支付金额" prop="actualPrice"/>-->

        <el-table-column align="center" width="140" label="创建时间" prop="gmtCreate">
          <template slot-scope="scope">
            <span>{{time(scope.row.gmtCreate)}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="140" label="物流渠道" prop="shipCode">
          <template slot-scope="scope">
            <el-tag>{{ express[scope.row.shipCode]}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" width="200" label="物流单号" prop="shipNo" />

        <el-table-column align="center" width="200" label="备注" prop="mono" />

        <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="scope.row.status === 20" type="primary" size="mini" @click="DeliveryOrder(scope.row)">配送单
            </el-button>
            <el-button v-if="scope.row.status === 20" type="primary" size="mini" @click="handleShip(scope.row)">发货
            </el-button>
            <el-button v-if="scope.row.status === 60" type="primary" size="mini" @click="handleRefund(scope.row)">退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>





    <div style="width: 100%;background-color: white;">
      <el-pagination style="padding: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]" :page.sync="form.pageNo" :limit.sync="form.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    orderList
  } from '../../api/operate/jrdermanage.js'
  export default {
    data() {
      return {
        form: {
          page: 1,
          limit: 10,
          orderNo: '', //订单编号
          status: '' //订单状态
        },
        status: {
          10: "未付款",
          12: "正在拼团",
          20: "待出库",
          30: "待收货",
          40: "待评价",
          50: "已完成",
          60: "退款中",
          70: "已退款",
          80: "已取消",
          90: "已取消(系统)"
        },
        payment: {
          WX: "微信支付",
          ALI: "支付宝",
          OFFLINE: "线下支付",
          undefined: "未支付"
        },
        downData:{
          gmtStart:'',
          gmtEnd:'',
          status:''
        },
        express: {
          NONE: "无需物流公司",
          SF: "顺丰速运",
          HTKY: "百世快递",
          ZTO: "中通快递",
          STO: "申通快递",
          YTO: "圆通速递",
          YD: "韵达速递",
          YZPY: "邮政快递包裹",
          EMS: "EMS",
          HHTT: "天天快递",
          JD: "京东快递",
          UC: "优速快递",
          DBL: "德邦快递",
          ZJS: "宅急送",
          TNT: "TNT快递",
          undefined: "未发货"
        },
        tableData: { // 返回的数据
          items: [],
          total: 0
        }
      }
    },
    mounted() {
      this.load()
    },
    methods: {
      load() {
        const that = this
        orderList(that.form).then(function(reds) {
          that.tableData = reds.data.data

        })
      },
      handleSizeChange(e) { // 点击控制页数
        this.form.limit = e
        this.load()
      },
      handleCurrentChange(e) { // 输入框控制页数
        this.form.page = e
        this.load()
      },
      time(time) { //时间戳转日期
        if (time !== undefined) {
          var date = new Date(time) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
          var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日'
          var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + '时'
          var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + '分'
          time = M + D + h + m
          return time
        } else {
          return '无'
        }
      },
      deliveryOrder(row) { //导出单行订单
        const that=this
        import('../../components/Excel.js').then(excel => {
          const header = [
            "订单编号",
            "商品名称",
            "规格",
            "单位",
            "配送数量",
            "配送地址",
            "收货人",
            "联系方式",
            "区域划分",
            "客服备注",
            "用户备注"
          ];
          const title = [
            "orderNo",
            "name",
            "specifications",
            "unit",
            "num",
            "address",
            "consignee",
            "phone",
            "area",
            "mono",
            "adminMono"
          ]
          excel.export_json_to_excel2(
            header, //表头 必填
            that.tableData.items, //具体数据 必填
            title,
            '订单信息'
          )
        })
      },
      DeliveryOrder(row) { //导出单行订单
        const arr = []
        arr.push(row)
        import('../../components/Excel.js').then(excel => {
          const header = [
            "订单编号",
            "商品名称",
            "规格",
            "单位",
            "配送数量",
            "配送地址",
            "收货人",
            "联系方式",
            "区域划分",
            "客服备注",
            "用户备注"
          ];
          const title = [
            "orderNo",
            "name",
            "specifications",
            "unit",
            "num",
            "address",
            "consignee",
            "phone",
            "area",
            "mono",
            "adminMono"
          ]
          excel.export_json_to_excel2(
            header, //表头 必填
            arr, //具体数据 必填
            title,
            '订单信息'
          )
        })
      }
    }
  }
</script>

<style>
</style>

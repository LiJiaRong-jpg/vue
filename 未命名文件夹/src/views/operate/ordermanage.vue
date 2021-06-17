<template>
  <div>
    <div>
      <div style="width: 100%;height: 60px;"></div>
      <el-input v-model="form.orderNo" clearable class="filter-item" style="width: 200px;margin: 0 10px;"
        placeholder="请输入订单编号" />
      <el-select v-model="form.status" style="width: 200px;margin: 0 10px;" class="filter-item" placeholder="请选择订单状态">
        <el-option v-for="(key, value) in status" :key="key" :label="key" :value="value" />
      </el-select>
      <el-button type="primary" style="position: relative;top: -15px;" icon="el-icon-search" @click="load">查找
      </el-button>
      <br />
      <el-date-picker v-model="downData.gmtStart" type="datetime" style="width: 200px;margin-left: 10px;"
        class="filter-item" default-time="00:00:00" placeholder="选择开始日期" />
      <span style="margin: 5px;display: inline-block;">至</span>
      <el-date-picker v-model="downData.gmtEnd" type="datetime" style="width: 200px" class="filter-item"
        default-time="00:00:00" placeholder="选择结束日期" />
      <el-select v-model="downData.status" style="width: 200px;margin: 0 10px;" class="filter-item" placeholder="待出库">
        <el-option v-for="(key, value) in status" :key="key" :label="key" :value="value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-download" style="position: relative;top: -15px;"
        @click="deliveryOrder">导出</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" style="position: relative;top: -15px;"
        @click="Summary">汇总</el-button>
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

        <el-table-column align="center" width="140" label="创建时间" prop="gmtCreate">
          <template slot-scope="scope">
            <span>{{time(scope.row.gmtCreate)}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="140" label="物流渠道" prop="shipCode">
          <template slot-scope="scope">
            <el-tag>{{ express[scope.row.shipCode]?express[scope.row.shipCode]:'未发货'}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" width="200" label="物流单号" prop="shipNo" />

        <el-table-column align="center" width="200" label="备注" prop="mono" />

        <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="details(scope.row)">详情</el-button>
            <el-button v-if="scope.row.status === 20" type="primary" size="mini" @click="DeliveryOrder(scope.row)">配送单</el-button>
            <el-button v-if="scope.row.status === 20" type="primary" size="mini" @click="detailsGoods(scope.row)">发货</el-button>
            <el-button v-if="scope.row.status === 60" type="primary" size="mini" @click="refund(scope.row)">退款</el-button>
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

    <!-- 订单详情弹出框 -->
    <el-dialog :visible.sync="detailsShow" title="订单详情" width="800">
      <el-form :data="detailsData" label-position="left">
        <el-form-item label="订单编号">
          <span>{{ detailsData.orderNo }}</span>
        </el-form-item>
        <el-form-item label="用户Id">
          <span>{{ detailsData.userId }}</span>
        </el-form-item>
        <el-form-item label="订单渠道">
          <span>{{ detailsData.channel }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <template>
            <el-tag>{{ status[detailsData.status]}}</el-tag>
          </template>
        </el-form-item>
        <el-form-item label="支付渠道">
          <template>
            <el-tag>{{ payment[detailsData.payChannel]}}</el-tag>
          </template>
        </el-form-item>
        <el-form-item label="用户留言">
          <span>{{ detailsData.mono }}</span>
        </el-form-item>
        <el-form-item label="客服备注">
          <span style="padding-right:10px">{{ detailsData.adminMono }}</span>
          <el-button type="primary" icon="el-icon-edit" @click="editRemarks">编辑</el-button>
        </el-form-item>
        <el-form-item label="配送费用">
          <template>
            <span>{{detailsData.freightPrice > 0 ? detailsData.freightPrice / 100.0 : "免运费"}}</span>
          </template>
        </el-form-item>
        <el-form-item label="收货信息">
          <span>
            （收货人）{{ detailsData.consignee }}
          </span>
          <span>
            （手机号）{{ detailsData.phone }}
          </span>
          <span>
            （地址）
            {{ detailsData.province }}
            {{ detailsData.city}}
            {{ detailsData.county }}
            {{ detailsData.address}}
            {{ detailsData.address }}
          </span>
        </el-form-item>
        <el-form-item label="商品信息">
          <el-table :data="detailsData.skuList" size="small" border fit highlight-current-row>
            <el-table-column align="center" label="名称" prop="spuTitle" />
            <el-table-column align="center" label="规格" prop="title" />
            <el-table-column align="center" label="商品数量" prop="num" />
            <el-table-column align="center" label="单位" prop="unit" />
            <el-table-column align="center" label="总价（单价*数量）">
              <template slot-scope="scope">
                <span>{{ (scope.row.price * scope.row.num) / 100 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="detailsGoodsShow" title="发货">
      <el-form status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="等级" prop="adminMonoLevel">
          <el-radio-group v-model="detailsData.adminMonoLevel">
            <el-radio :label="0">无色</el-radio>
            <el-radio :label="1">绿色</el-radio>
            <el-radio :label="2">橙黄</el-radio>
            <el-radio :label="3">红色</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" prop="adminMono">
          <el-input v-model="adminMono" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsGoodsShow = false">取消</el-button>
        <el-button type="primary" @click="DetailsEditor">确定</el-button>
      </div>
    </el-dialog>

    <!-- 发货弹出框 -->
    <el-dialog :visible.sync="deliverGoodsShow" title="发货">
      <el-form ref="deliverGoodsForm" :model="deliverGoodsForm" status-icon label-position="left" label-width="100px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="快递公司" prop="shipCode">
          <el-select v-model="deliverGoodsForm.shipCode" placeholder="请选择快递公司">
            <el-option v-for="(key, value) in express" :key="key" :label="key" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="快递编号" prop="shipNo">
          <el-input v-model="deliverGoodsForm.shipNo" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deliverGoodsShow = false">取消</el-button>
        <el-button type="primary" @click="deliverGoods">确定</el-button>
      </div>
    </el-dialog>

    <!-- 退款弹出框 -->
    <el-dialog :visible.sync="refundShow" title="退款">
      <el-form ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="tips">
          <span>允许退款后钱会退回对方账户，请确认您已经收到退货</span>
        </el-form-item>
        <el-form-item label="操作">
          <el-radio v-model="refundForm.type" label="0">拒绝退款</el-radio>
          <el-radio v-model="refundForm.type" label="1">允许退款</el-radio>
        </el-form-item>
        <el-form-item v-if="refundForm.type === '1' " label="金额">
          <el-input v-model="refundForm.sum" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="refuseRefund">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  orderList,
  summary,
  detailsList,
  detailsEditor,
  DeliverGoods,
  RefuseRefund
} from '../../api/operate/ordermanage.js'
export default {
  data () {
    return {
      form: {
        page: 1,
        limit: 10,
        orderNo: '', // 订单编号
        status: '' // 订单状态
      },
      status: {
        10: '未付款',
        12: '正在拼团',
        20: '待出库',
        30: '待收货',
        40: '待评价',
        50: '已完成',
        60: '退款中',
        70: '已退款',
        80: '已取消',
        90: '已取消(系统)'
      },
      payment: {
        WX: '微信支付',
        ALI: '支付宝',
        OFFLINE: '线下支付',
        undefined: '未支付'
      },
      downData: {
        gmtStart: undefined,
        gmtEnd: undefined,
        status: '10'
      },
      express: {
        NONE: '无需物流公司',
        SF: '顺丰速运',
        HTKY: '百世快递',
        ZTO: '中通快递',
        STO: '申通快递',
        YTO: '圆通速递',
        YD: '韵达速递',
        YZPY: '邮政快递包裹',
        EMS: 'EMS',
        HHTT: '天天快递',
        JD: '京东快递',
        UC: '优速快递',
        DBL: '德邦快递',
        ZJS: '宅急送',
        TNT: 'TNT快递'
      },
      tableData: { // 返回的数据
        items: [],
        total: 0
      },
      detailsData: {
        skuList: []
      }, // 详情弹出框的数据
      detailsShow: false, // 详情弹出框的显隐
      detailsGoodsShow: false, // 详情的发货弹出框的显隐
      adminMono: '',
      deliverGoodsShow: false, // 发货弹出框的显隐
      deliverGoodsForm: {
        shipCode: 'SF',
        shipNo: '',
        orderNo: ''
      },
      refundShow: false, // 删除弹出框的显隐
      refundForm: {
        type: '0',
        sum: '',
        orderNo: ''
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      const that = this
      orderList(that.form).then(function (reds) {
        that.tableData = reds.data.data
      })
    },
    handleSizeChange (e) { // 点击控制页数
      this.form.limit = e
      this.load()
    },
    handleCurrentChange (e) { // 输入框控制页数
      this.form.page = e
      this.load()
    },
    time (time) { // 时间戳转日期
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
    deliveryOrder (row) { // 导出单行订单
      const that = this
      import('../../components/Excel.js').then(excel => {
        const header = [
          '订单编号',
          '商品名称',
          '规格',
          '单位',
          '配送数量',
          '配送地址',
          '收货人',
          '联系方式',
          '区域划分',
          '客服备注',
          '用户备注'
        ]
        const title = [
          'orderNo',
          'name',
          'specifications',
          'unit',
          'num',
          'address',
          'consignee',
          'phone',
          'area',
          'mono',
          'adminMono'
        ]
        excel.export_json_to_excel2(
          header, // 表头 必填
          that.tableData.items, // 具体数据 必填
          title,
          '订单信息'
        )
      })
    },
    DeliveryOrder (row) { // 导出单行订单
      detailsList(row.id).then(function (reds) {
        const sku = reds.data.data.skuList
        for (var i = 0; i < reds.data.data.skuList.length; i++) {
          sku[i].unit = sku[i].unit
          sku[i].num = sku[i].num
          sku[i].specifications = sku[i].title
          sku[i].barcode = sku[i].barCode
          sku[i].name = sku[i].spuTitle
        }
        import('../../components/Excel.js').then(excel => {
          const header = ['订单编号', '商品名称', '规格', '单位', '配送数量', '配送地址', '收货人', '联系方式', '区域划分', '客服备注', '用户备注']
          const title = ['orderNo', 'name', 'specifications', 'unit', 'num', 'address', 'consignee', 'phone',
            'area', 'mono', 'adminMono'
          ]
          excel.export_json_to_excel2(header, reds.data.data.skuList, title, '订单信息')
        })
      })
    },
    Summary () { // 汇总
      const that = this
      const param = {}
      if (this.downData.gmtStart != undefined || this.downData.gmtStart != null) {
        param.gmtStart = this.downData.gmtStart.getTime() // 转时间戳
      }
      if (this.downData.gmtEnd != undefined || this.downData.gmtEnd != null) {
        param.gmtEnd = this.downData.gmtEnd.getTime()
      }
      summary(param).then(function (reds) {
        if (reds.data.data == null || reds.data.data.length === 0) {
          that.mess ? that.mess.close() : ''
          that.mess = that.$message({
            showClose: true,
            message: '没有信息可以打印',
            type: 'error'
          })
        } else {
          import('../../components/Excel.js').then(function (excel) {
            const tHeader = ['商品名称', 'spuId', '规格', 'skuId', '数量']
            const filterVal = ['spuTitle', 'spuId', 'skuTitle', 'skuId', 'num']
            excel.export_json_to_excel2(tHeader, reds.data.data, filterVal, '汇总信息')
          })
        }
      })
    },
    details (data) { // 点击详情
      const that = this
      detailsList(data.id).then(function (reds) {
        that.detailsData = reds.data.data
      })
      this.detailsShow = true
    },
    editRemarks () {
      this.adminMono = this.detailsData.adminMono
      this.detailsGoodsShow = true
      this.deliverGoodsData.adminMono = this.detailsData.adminMono
    },
    DetailsEditor () { // 订单编辑修改确定
      if (!this.detailsData) {
        this.$message.error('数据不对，请刷新页面重')
        return
      }
      this.detailsData.adminMono = this.adminMono
      detailsEditor(
        this.detailsData.id,
        this.detailsData.adminMonoLevel,
        this.detailsData.adminMono
      )
        .then(() => {
          this.$message({
            message: '客服备注成功！',
            type: 'success'
          })

          this.detailsGoodsShow = false
        })
        .catch(() => {
          this.shipSubmiting = false
        })
    },
    detailsGoods (row) { // 点击发货
      this.deliverGoodsShow = true
      this.deliverGoodsForm = {
        orderNo: row.orderNo,
        shipNo: '',
        shipCode: 'SF'
      }
    },
    deliverGoods () { // 发货弹出框确定
      const that = this
      if (that.deliverGoodsForm.shipNo.trim() != '') {
        DeliverGoods(that.deliverGoodsForm).then(function (reds) {
          if (reds.data.errmsg == '成功') {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: '发货成功',
              type: 'success'
            })
            that.load()
          } else {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: reds.data.errmsg,
              type: 'error'
            })
          }
        })
      } else {
        that.mess ? that.mess.close() : ''
        that.mess = that.$message({
          showClose: true,
          message: '快递编号不能为空',
          type: 'error'
        })
      }
    },
    refund (row) {
      this.refundShow = true
      this.refundForm = {
        type: '0',
        orderNo: row.orderNo,
        sum: row.payPrice / 100.0
      }
    },
    refuseRefund () {
      const that = this
      if (that.refundForm.type == '0') {
        that.refundForm.sum = that.refundForm.sum * 100
        RefuseRefund(that.refundForm).then(function (reds) {
          if (reds.data.errmsg == '成功') {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: '拒绝退款成功',
              type: 'success'
            })
            that.refundShow = false
            that.load()
          } else {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: reds.data.errmsg,
              type: 'error'
            })
          }
        })
      } else {
        that.mess ? that.mess.close() : ''
        that.mess = that.$message({
          showClose: true,
          message: '暂不支持退款',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style>
</style>

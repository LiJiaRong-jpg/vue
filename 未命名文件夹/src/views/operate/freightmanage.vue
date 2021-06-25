<template>
  <div>
    <div>
      <div style="width: 100%;height: 60px;"></div>
      <div>
        <el-button style="position: relative;left: 10px;" class="filter-item" type="primary" icon="el-icon-search"
          @click="add" v-permission="'operation:freight:create'">添加</el-button>
      </div>
    </div>

    <el-table :data="tableData.items" style="width: 95%;margin: auto;margin-top: 20px;"
      :default-sort="{prop: 'date', order: 'descending'}" border="">
      <el-table-column align="center" label="模板编号" prop="freightTemplateDO.id" />

      <el-table-column align="center" label="模板名称" width="300" prop="freightTemplateDO.templateName" />
      <el-table-column align="center" label="宝贝地址" prop="freightTemplate.DOspuLocation" />

      <el-table-column align="center" label="发货期限" prop="freightTemplateDO.deliveryDeadline">
        <template slot-scope="scope">
          <span>{{ scope.row.freightTemplateDO.deliveryDeadline }}天</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认包邮门栏" prop="freightTemplateDO.defaultFreePrice">
        <template slot-scope="scope">
          <span>{{
            scope.row.freightTemplateDO.defaultFreePrice
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认计费首次发货数量" prop="freightTemplateDO.defaultFirstNum">
        <template slot-scope="scope">
          <span>{{ scope.row.freightTemplateDO.defaultFirstNum }}件</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认计费首次发货价格" prop="freightTemplateDO.defaultFirstMoney">
        <template slot-scope="scope">
          {{ scope.row.freightTemplateDO.defaultFirstMoney }}元
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认计费续件数量" prop="freightTemplateDO.defaultContinueNum">
        <template slot-scope="scope">
          <span>{{ scope.row.freightTemplateDO.defaultContinueNum }}件</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认计费续件价格" prop="freightTemplateDO.defaultContinueMoney">
        <template slot-scope="scope">
          <span>{{ scope.row.freightTemplateDO.defaultContinueMoney }}元</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="指定地区数量" prop="freightTemplateCarriageDOList.length" />
      <el-table-column align="center" label="操作" prop="type" width="200px;">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="UPDARE(scope.row)" v-permission="'operation:freight:update'">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteRow(scope)" v-permission="'operation:freight:delete'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer :title="title" :visible.sync="show" direction="ttb" size="100%">
      <div style="overflow-y: auto;width: 100%;height: 80vh;">
        <el-form ref="addForm" :model="addForm" status-icon label-position="left" label-width="150px"
          style="width: 700px; margin-left:50px;">
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="addForm.templateName" clearable placeholder="" />
          </el-form-item>
          <el-form-item label="发货地址" prop="spuLocation">
            <el-input v-model="addForm.spuLocation" clearable placeholder="" />
          </el-form-item>
          <el-form-item label="发货期限" prop="deliveryDeadline">
            <el-input type='number' v-model.number="addForm.deliveryDeadline" clearable placeholder>
              <template slot="append">
                天
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="是否包邮" prop="isFree">
            <template>
              <el-radio-group v-model="addForm.freeShipping">
                <el-radio :label="-1">坚决不包邮</el-radio>
                <el-radio :label="0">卖家承担包邮</el-radio>
                <el-radio :label="1">设定满额包邮</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <el-form-item v-if="addForm.freeShipping == 1" label="默认包邮额度" prop="defaultFreePrice">
            <el-input type='number' v-model.number="addForm.defaultFreePrice" placeholder="默认包邮额度">
              <template slot="append">
                元
              </template>
            </el-input>
          </el-form-item>
          <div v-if="addForm.freeShipping!=0">
            <el-form-item label="计费首次数量" prop="defaultFirstNum">
              <el-input type='number' v-model.number="addForm.defaultFirstNum" clearable placeholder="">
                <template slot="append">
                  件
                  <el-tooltip class="item" effect="dark" content="当用户购买商品数量小于 ‘这个数’ 就支付默认首次发货价格的运费"
                    placement="top-start">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="计费首次价格" prop="defaultFirstPrice">
              <el-input type='number' v-model.number="addForm.defaultFirstPrice" clearable placeholder="">
                <template slot="append">
                  元
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="计费续件数量" prop="defaultContinueNum">
              <el-input type='number' v-model.number="addForm.defaultContinueNum" clearable placeholder="">
                <template slot="append">
                  件
                  <el-tooltip class="item" effect="dark" content="当用户购买数量高于 ‘首次发货数量’ 每多 N 件，就须额外支付 ‘续件价格’"
                    placement="top-start">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="计费续件价格" prop="defaultContinuePrice">
              <el-input type='number' v-model.number="addForm.defaultContinuePrice" clearable placeholder="">
                <template slot="append">
                  元
                  <el-tooltip class="item" effect="dark" content="若不需要计件额外算运费，则直接填0即可" placement="top-start"><i
                      class="el-icon-question" /></el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <el-form-item label="指定地区价格" prop="freightTemplateCarriageDOList">
            <el-button :plain="true" type="primary" @click="Show=true">添加</el-button>
            <el-table :data="addForm.freightTemplateCarriageDOList">
              <el-table-column property="id" label="指定地区ID" v-if="title=='编辑'" />
              <el-table-column property="designatedArea" label="指定省份" />
              <el-table-column property="firstNum" label="首次数量" />
              <el-table-column property="firstMoney" label="首次价格" />
              <el-table-column property="continueNum" label="续件数量" />
              <el-table-column property="continueMoney" label="续件价格" />
              <el-table-column property="freePrice" label="满额包邮门栏" />
              <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="deleteRess(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div style="float: right;">
          <el-button @click="show = false">取消</el-button>
          <el-button v-if="title=='创建'" type="primary" @click="addTemplate">确定</el-button>
          <el-button v-if="title=='编辑'" type="primary" @click="Update">确定</el-button>
        </div>
      </div>

      <el-dialog title="添加指定地区" :visible.sync="Show" :append-to-body="true">

        <el-form ref="addRess" :model="addRess" status-icon label-position="left" label-width="100px"
          style="width: 90%; margin-left:50px;">
          <el-form-item label="包邮门栏" prop="freePrice">
            <el-input type='number' v-model.number="addRess.freePrice" clearable>
              <template slot="append">
                元
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="首次数量" prop="firstNum">
            <el-input type='number' v-model.number="addRess.firstNum" clearable>
              <template slot="append">
                件
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="首次价格" prop="firstMoney">
            <el-input type='number' v-model.number="addRess.firstMoney" placeholder="" clearable>
              <template slot="append">
                元
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="续件数量" prop="continueNum">
            <el-input type='number' v-model.number="addRess.continueNum" placeholder="" clearable>
              <template slot="append">
                件
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="续件价格" prop="continueMoney">
            <el-input type='number' v-model.number="addRess.continueMoney" placeholder="" clearable>
              <template slot="append">
                元
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="指定地区" prop="designatedAreaList">
            <template>
              <el-checkbox-group v-model="addRess.designatedAreaList">
                <el-checkbox v-for="(key, index) in ressList" :label="key" :key="index">{{ key }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="Show = false">取 消</el-button>
          <el-button type="primary" @click="AddRess">确 定</el-button>
        </div>
      </el-dialog>
    </el-drawer>

  </div>
</template>

<script>
import {
  getAllFreightTemplate,
  deleteFreightTemplate,
  addFreightTemplate,
  updateFreightTemplate
} from '../../api/operate/freightmanage.js'
export default {
  data () {
    return {
      tableData: { // 返回的数据
        items: []
      },
      show: false,
      Show: false,
      title: '创建',
      addForm: { // 添加模板
        templateName: '', // 模板名称
        spuLocation: '', // 发货地址
        deliveryDeadline: '', // 发货期限
        freeShipping: -1, // 是否包邮
        defaultFreePrice: 68, // 默认包邮额度
        defaultFirstNum: 1, // 默认首费
        defaultFirstPrice: 0, // 默认首件数量
        defaultContinueNum: 1, // 默认续费
        defaultContinuePrice: 0, // 默认续件数量
        freightTemplateCarriageDOList: [
          /* {designatedArea:'',//指定省份
              firstNum:'',//首次数量
              firstMoney:'',//首次价格
              continueNum:'',//续件数量
              continueMoney:'',//续件价格
              freePrice:''//满额包邮门栏} */
        ] // 特殊运费区
      },
      addRess: { // 添加指定地区运费
        freePrice: 0, // 包邮门栏
        firstNum: 1, // 首次数量
        firstMoney: 0, // 首次价格
        continueNum: 1, // 续件数量
        continueMoney: 0, // 续件价格
        designatedArea: '', // 指定地区
        designatedAreaList: [] // 指定地区
      },
      ressList: [
        '北京市', '天津市', '河北省',
        '山西省', '内蒙古自治区', '辽宁省',
        '吉林省', '黑龙江省', '上海市', '江苏省',
        '浙江省', '安徽省', '福建省',
        '江西省', '山东省', '河南省',
        '湖北省', '湖南省', '广东省',
        '广西壮族自治区', '海南省', '重庆市',
        '四川省', '贵州省', '云南省', '西藏自治区',
        '陕西省', '甘肃省', '青海省',
        '宁夏回族自治区', '新疆维吾尔自治区',
        '台湾省', '香港特别行政区', '澳门特别行政区'
      ]
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      const that = this
      getAllFreightTemplate().then(function (reds) {
        that.tableData.items = reds.data.data
      })
    },
    TIME (time) { // 时间戳转日期
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
    deleteRow (row) { // 删除运费模板
      const that = this
      this.$confirm('此操作将永久删除该运费模板---' + row.row.freightTemplateDO.templateName + '---, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFreightTemplate(row.row.freightTemplateDO.id).then(function (reds) {
          if (reds.data.errmsg === '成功') {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: '删除成功',
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
      })
    },
    add () { // 点击添加
      this.show = true
      this.title = '创建'
      this.addForm = { // 清除上次打开的残留
        templateName: '', // 模板名称
        spuLocation: '', // 发货地址
        deliveryDeadline: 1, // 发货期限
        freeShipping: -1, // 是否包邮
        defaultFreePrice: 68, // 默认包邮额度
        defaultFirstNum: 1, // 默认首费
        defaultFirstPrice: 0, // 默认首件数量
        defaultContinueNum: 1, // 默认续费
        defaultContinuePrice: 0, // 默认续件数量
        freightTemplateCarriageDOList: [] // 特殊运费区
      }
    },
    UPDARE (row) { // 点击编辑
      const Row = JSON.parse(JSON.stringify(row)) // 赋值给一个常量不去改表单中的内容，防止报错
      this.addForm = {
        templateId: Row.freightTemplateDO.id,
        defaultFirstPrice: Row.freightTemplateDO.defaultFirstMoney,
        defaultContinuePrice: Row.freightTemplateDO.defaultContinueMoney,
        templateName: Row.freightTemplateDO.templateName,
        spuLocation: Row.freightTemplateDO.spuLocation,
        deliveryDeadline: Row.freightTemplateDO.deliveryDeadline,
        defaultFreePrice: Row.freightTemplateDO.defaultFreePrice,
        defaultFirstNum: Row.freightTemplateDO.defaultFirstNum,
        defaultContinueNum: Row.freightTemplateDO.defaultContinueNum,
        freightTemplateCarriageDOList: Row.freightTemplateCarriageDOList,
        isFree: -1,
        freeShipping: -1
      }
      this.title = '编辑'
      this.show = true
    },
    AddRess () { // 添加特殊运费区
      const _ress = this.addRess
      if (_ress.freePrice >= 0 && _ress.continueMoney >= 0 && _ress.designatedAreaList.length != 0) {
        if (_ress.firstNum > 0 && _ress.continueNum > 0) {
          this.Show = false
          for (var i = 0; i < this.addRess.designatedAreaList.length; i++) {
            this.addRess.designatedArea += this.addRess.designatedAreaList[i]
            if (i < this.addRess.designatedAreaList.length - 1) {
              this.addRess.designatedArea += ','
            }
          }
          this.addForm.freightTemplateCarriageDOList.unshift(this.addRess)
          this.addRess = {
            freePrice: 0,
            firstNum: 1,
            firstMoney: 0,
            continueNum: 1,
            continueMoney: 0,
            designatedAreaList: [],
            designatedArea: ''
          }
        } else {
          this.mess ? this.mess.close() : ''
          this.mess = this.$message({
            showClose: true,
            message: '第一次数量需大于0,续件数量需大于0',
            type: 'error'
          })
        }
      } else {
        this.mess ? this.mess.close() : ''
        this.mess = this.$message({
          showClose: true,
          message: '请完整表单',
          type: 'error'
        })
      }
    },
    deleteRess (index) { // 删除特殊运费区
      const that = this
      this.$confirm('此操作将删除特殊运费区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.addForm.freightTemplateCarriageDOList.splice(index, 1)
        this.mess ? this.mess.close() : ''
        this.mess = this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    addTemplate () { // 添加运费模板
      const _ress = this.addForm
      if (_ress.deliveryDeadline - '' > 0 && _ress.defaultFreePrice - '' > 0 && _ress.defaultFirstNum - '' >= 0 &&
          _ress.defaultContinueNum - '' > 0 && _ress.defaultContinuePrice - '' >= 0 && _ress.templateName.trim() !=
          '' && _ress.spuLocation.trim() != '') {
        if (_ress.freeShipping == -1) {
          _ress.defaultFreePrice = 0
          this.AddFreightTemplate()
        } else if (_ress.freeShipping == 0) {
          _ress.defaultFreePrice = 0
          _ress.defaultFirstNum = 1
          _ress.defaultFirstPrice = 0
          _ress.defaultContinueNum = 1
          _ress.defaultContinuePrice = 0
          this.AddFreightTemplate()
        } else {
          this.AddFreightTemplate()
        }
      } else {
        this.mess ? this.mess.close() : ''
        this.mess = this.$message({
          showClose: true,
          message: '请正确填写表单',
          type: 'error'
        })
      }
    },
    AddFreightTemplate () { // 添加运费模板
      const that = this
      that.addForm.freightTemplateCarriageDOList = JSON.stringify(that.addForm.freightTemplateCarriageDOList)
      addFreightTemplate(that.addForm).then(function (reds) {
        if (reds.data.errmsg === '成功') {
          that.mess ? that.mess.close() : ''
          that.mess = that.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          that.show = false
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
    },
    Update () { // 修改模板
      const that = this
      const addFor = JSON.parse(JSON.stringify(that.addForm)) // 通过这样使它是赋值而不是赋地址，否则给它里面的数据转类型会报错
      addFor.freightTemplateCarriageDOList = JSON.stringify(addFor.freightTemplateCarriageDOList)
      updateFreightTemplate(addFor).then(function (reds) {
        if (reds.data.errmsg === '成功') {
          that.mess ? that.mess.close() : ''
          that.mess = that.$message({
            showClose: true,
            message: '编辑成功',
            type: 'success'
          })
          that.show = false
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
    }
  }
}
</script>

<style>
</style>

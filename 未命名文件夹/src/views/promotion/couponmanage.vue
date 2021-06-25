<template>
  <div>
    <div style="width: 100%;height: 60px;"></div>
    <div class="filter-container" style="margin-left: 20px;margin-bottom: 20px;">
      <el-input v-model="form.title" clearable class="filter-item" style="width: 200px;" placeholder="请输入优惠劵标题" />
      <el-select v-model="form.type" style="width: 200px;margin: 0 10px;" placeholder="请选择优惠劵类型">
        <el-option v-for="(key, index) in statusDic" :key="index" :label="key.name" :value="key.value" />
      </el-select>
      <el-select v-model="form.status" style="width: 200px;" placeholder="请选择优惠劵状态">
        <el-option v-for="(key, index) in statusdic" :key="index" :label="key.name" :value="key.value" />
      </el-select>
      <el-button style="position: relative;top: -13px;left: 10px;" class="filter-item" type="primary"
        icon="el-icon-search" @click="load" v-permission="'promote:coupon:query'">查找</el-button>
      <el-button style="position: relative;top: -13px;left: 10px;" class="filter-item" type="primary"
        icon="el-icon-edit" @click="handleCreate" v-permission>添加</el-button>
      <el-button style="position: relative;top: -13px;left: 10px;" class="filter-item" type="primary"
        icon="el-icon-edit" @click="Export">当前页导出</el-button>
    </div>

    <el-table :data="tableData.items" style="width: 95%;margin: auto;margin-top: 20px;"
      :default-sort="{prop: 'date', order: 'descending'}" border="">

      <el-table-column align="center" label="优惠券ID" prop="id" sortable />

      <el-table-column align="center" label="优惠券名称" prop="title" />

      <el-table-column align="center" label="优惠券类型" prop="type">
        <template slot-scope="scope">
          <span>{{scope.row.type=="1"?"满减劵":"全部"}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="介绍" prop="description" />

      <el-table-column align="center" label="优惠券数量" prop="total">
      </el-table-column>

      <el-table-column align="center" label="剩余数量" prop="surplus">
      </el-table-column>

      <el-table-column align="center" label="每人限领" prop="limit">
      </el-table-column>

      <el-table-column align="center" label="满减金额" prop="discount">
        <template slot-scope="scope"><span>减免{{ scope.row.discount }}元</span></template>
      </el-table-column>

      <el-table-column align="center" label="最低消费" prop="min">
        <template slot-scope="scope"><span>满{{ scope.row.min }}元可用</span></template>
      </el-table-column>

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">
            {{tabStatus(scope.row.status)}}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="使用类目名称" prop="categoryTitle" width="100">
        <template slot-scope='scope'>
          <el-tag>
            {{
                            scope.row.categoryTitle != null
                              ? scope.row.categoryTitle
                              : "全部类目"
                          }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column v-show="false" align="center" label="使用类目ID" prop="categoryId" width="100" />

      <el-table-column align="center" label="领券相对天数" prop="days">
      </el-table-column>
      <el-table-column align="center" label="领券开始时间" prop="gmtStart">
        <template slot-scope='scope'>
          <span> {{time(scope.row.gmtStart,1,scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="领券结束时间" prop="gmtEnd">
        <template slot-scope='scope'>
          <span>{{time(scope.row.gmtEnd,2,scope.$index)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="UpdateStatus(scope)" v-permission>{{scope.row.status==0?"激活":"冻结"}}
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope)" v-permission>编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteRow(scope)" v-permission>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="width: 100%;background-color: white;">
      <el-pagination style="padding: 20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]" :page.sync="form.pageNo" :limit.sync="form.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="show">
      <el-form ref="form" :model="addForm" label-width="100px">
        <el-form-item label="优惠劵名称">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="优惠劵类型">
          <el-select v-model="addForm.type" style="width: 200px;margin: 0 10px;" placeholder="请选择优惠劵类型">
            <el-option v-for="(key, index) in statusDic" :key="index" :label="key.name" :value="key.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="优惠劵数量">
          <el-input v-model="addForm.total" onkeyup="this.value=this.value.replace(/\D/g,'')">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item label="每人限领">
          <el-input v-model="addForm.limit" onkeyup="this.value=this.value.replace(/\D/g,'')">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item label="满减金额">
          <el-input v-model="addForm.discount" onkeyup="this.value=this.value.replace(/\D/g,'')">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低消费">
          <el-input v-model="addForm.min" onkeyup="this.value=this.value.replace(/\D/g,'')">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="优惠劵状态">
          <el-select v-model="addForm.status" style="width: 200px;" placeholder="请选择优惠劵状态">
            <el-option v-for="(key, index) in statusdic" :key="index" :label="key.name" :value="key.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期">
          <el-radio-group v-model="addForm.timeType">
            <el-radio-button :label="0">领券相对天数</el-radio-button>
            <el-radio-button :label="1">指定绝对时间</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="addForm.timeType === 0" prop="days">
          <el-input v-model="addForm.days" onkeyup="this.value=this.value.replace(/\D/g,'')">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item v-show="addForm.timeType === 1" prop="time">
          <el-col :span="11">
            <el-date-picker v-model="addForm.gmtStart" type="datetime" placeholder="选择日期" style="width: 100%;" />
          </el-col>
          <el-col :span="2" class="line" style="text-align: center;">至</el-col>
          <el-col :span="11">
            <el-date-picker v-model="addForm.gmtEnd" type="datetime" placeholder="选择日期" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="商品限制范围">
          <el-radio-group v-model="addForm.goodsType" :disabled="title === '编辑'">
            <el-radio-button :label="0">全场通用</el-radio-button>
            <el-radio-button :label="1">指定分类</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="addForm.goodsType === 1" label="优惠类目">
          <el-cascader v-model="addForm.categoryTitle" :options="options" placeholder="优惠类目" filterable />
        </el-form-item>
      </el-form>
      <div style="float: right;">
        <el-button @click="show = false">取消</el-button>
        <el-button v-if="title=='创建'" type="primary" @click="couADD">确定</el-button>
        <el-button v-if="title=='编辑'" type="primary" @click="couPUDARE">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  couList,
  deleteCou,
  updateStatus,
  classIfication,
  addCou,
  pudateCou
} from '../../api/promotion/couponmanage.js'
export default {
  data () {
    return {
      form: { // 优惠劵列表请求数据
        pageNo: 1,
        limit: 10,
        title: '',
        status: '',
        type: ''
      },
      statusDic: [{
        value: 1,
        name: '满减卷'
      }
      ],
      statusdic: [{
        value: 0,
        name: '下架'
      },
      {
        value: 1,
        name: '正常'
      },
      {
        value: -1,
        name: '已过期'
      }
      ],
      tableData: { // 返回的数据
        items: [],
        total: 0
      },
      index: 0, // 点击tab列表中的按钮的位置
      show: false, // 弹出框的显隐
      title: '创建', // 弹出框的标题
      addForm: { // 添加修改优惠劵所需的数据
        title: '', // 标题
        type: '', // 类型
        status: '', // 状态
        description: '', // 描述
        limit: 1, // 用户能领取几张
        discount: 10, // 优惠价格
        min: 10, // 满足优惠的最低价格
        total: 1, // 优惠劵总数
        categoryId: '', // 类别
        days: 1, // 优惠时长
        gmtStart: '', // 优惠开始时间
        gmtEnd: '', // 优惠结束时间
        timeType: 0,
        goodsType: 0,
        categoryTitle: []
      },
      options: []
    }
  },
  mounted () {
    const that = this
    this.load()
    classIfication().then(function (reds) {
      that.options = reds.data.data
    })
  },
  methods: {
    load () {
      const that = this
      couList(this.form).then(function (reds) {
        that.tableData = reds.data.data
      })
    },
    handleSizeChange (e) { // 点击控制页数
      this.form.limit = e
      this.load()
    },
    handleCurrentChange (e) { // 输入框控制页数
      this.form.pageNo = e
      this.load()
    },
    tabStatus (status) {
      switch (status) {
        case -1:
          status = '已过期'
          break
        case 0:
          status = '下架'
          break
        case 1:
          status = '正常'
          break
        default:
          status = '错误状态'
          break
      }
      return status
    },
    time (start, who, Index) {
      if (start !== undefined) {
        var date = new Date(start) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
        start = Y + M + D
        if (who == 1) {
          this.tableData.items[Index].gmtStart = start
        } else {
          this.tableData.items[Index].gmtEnd = start
        }
      } else {
        start = '无'
      }
      return start
    },
    deleteRow (row) { // 删除优惠劵
      const that = this
      this.index = row.$index
      this.$confirm('此操作将永久删除该优惠劵---' + row.row.title + '---, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCou(row.row.id).then(function (reds) {
          if (reds.data.errmsg === '成功') {
            that.tableData.items.splice(that.index, 1)
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            if (that.tableData.items.length < 2) {
              that.load()
            }
          } else {
            that.mess ? that.mess.close() : ''
            that.mess = that.$message({
              showClose: true,
              message: reds.data.errmsg,
              type: 'error'
            })
            that.load()
          }
        })
      })
    },
    UpdateStatus (row) { // 修改优惠劵状态
      const that = this
      if (row.row.status === 0) {
        row.row.status = 1
      } else {
        row.row.status = 0
      }
      updateStatus(row.row).then(function (reds) {
        if (reds.data.errmsg === '成功') {
          that.mess ? that.mess.close() : ''
          that.mess = that.$message({
            showClose: true,
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
          that.load()
        } else {
          that.$message({
            showClose: true,
            message: reds.data.errmsg,
            type: 'error'
          })
        }
      })
    },
    handleCreate () { // 点击添加
      this.title = '创建'
      this.show = true
      this.addForm = {
        title: '',
        type: 1,
        status: 0,
        description: '',
        limit: 1, // 用户能领取几张
        discount: 10, // 优惠价格
        min: 10, // 满足优惠的最低价格
        total: 1, // 优惠劵总数
        categoryId: '',
        days: 1, // 优惠时长
        gmtStart: '',
        gmtEnd: '',
        timeType: 0,
        goodsType: 0,
        categoryTitle: []
      }
    },
    handleUpdate (row) { // 点击编辑
      this.title = '编辑'
      this.addForm = JSON.parse(JSON.stringify(row.row))
      this.addForm.timeType = 0
      this.addForm.goodsType = 0
      this.addForm.categoryTitle = []
      this.show = true
      if (row.row.gmtStart) { // 有效期是展开相对天数还是绝对时间
        this.addForm.timeType = 1
      } else {
        this.addForm.timeType = 0
      }
    },
    couADD () { // 添加优惠劵
      if (this.addForm.timeType == 0) {
        this.addForm.gmtStart = ''
        this.addForm.gmtEnd = ''
      } else {
        this.addForm.days = ''
        var start = new Date(this.addForm.gmtStart)
        var end = new Date(this.addForm.gmtEnd)
        this.addForm.gmtStart = start.getTime()
        this.addForm.gmtEnd = end.getTime()
      }
      if (this.addForm.title.trim() !== '') {
        if (this.addForm.total !== '') {
          if (this.addForm.limit !== '') {
            if (this.addForm.discount !== '') {
              if (this.addForm.min !== '') {
                if (this.addForm.min >= this.addForm.discount) {
                  if (this.addForm.min >= this.addForm.discount) {
                    if (this.addForm.min >= this.addForm.discount) {
                      this.add()
                    } else {
                      this.$message({
                        showClose: true,
                        message: '最低消费应大于等于满减金额',
                        type: 'error'
                      })
                    }
                  } else {
                    this.$message({
                      showClose: true,
                      message: '',
                      type: 'error'
                    })
                  }
                } else {
                  this.$message({
                    showClose: true,
                    message: '最低消费应大于等于满减金额',
                    type: 'error'
                  })
                }
              } else {
                this.$message({
                  showClose: true,
                  message: '优惠劵使用门栏不能为空',
                  type: 'error'
                })
              }
            } else {
              this.$message({
                showClose: true,
                message: '优惠劵折扣金额不能为空',
                type: 'error'
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: '优惠劵限领不能为空',
              type: 'error'
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '优惠劵总量不能为空',
            type: 'error'
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: '优惠劵标题不能为空',
          type: 'error'
        })
      }
    },
    add () {
      const that = this
      addCou(that.addForm).then(function (reds) {
        if (reds.data.errmsg === '成功') {
          that.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          that.show = false
          that.load()
        } else {
          that.$message({
            showClose: true,
            message: reds.data.errmsg,
            type: 'error'
          })
        }
      })
    },
    couPUDARE () {
      if (this.addForm.timeType == 0) {
        this.addForm.gmtStart = ''
        this.addForm.gmtEnd = ''
      } else {
        this.addForm.days = ''
        var start = new Date(this.addForm.gmtStart)
        var end = new Date(this.addForm.gmtEnd)
        this.addForm.gmtStart = start.getTime()
        this.addForm.gmtEnd = end.getTime()
      }
      if (this.addForm.title.trim() !== '') {
        if (this.addForm.total !== '') {
          if (this.addForm.limit !== '') {
            if (this.addForm.discount !== '') {
              if (this.addForm.min !== '') {
                if (this.addForm.min >= this.addForm.discount) {
                  this.pudate()
                } else {
                  this.$message({
                    showClose: true,
                    message: '最低消费应大于等于满减金额',
                    type: 'error'
                  })
                }
              } else {
                this.$message({
                  showClose: true,
                  message: '优惠劵使用门栏不能为空',
                  type: 'error'
                })
              }
            } else {
              this.$message({
                showClose: true,
                message: '优惠劵折扣金额不能为空',
                type: 'error'
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: '优惠劵限领不能为空',
              type: 'error'
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '优惠劵总量不能为空',
            type: 'error'
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: '优惠劵标题不能为空',
          type: 'error'
        })
      }
    },
    pudate () {
      const that = this
      pudateCou(that.addForm).then(function (reds) {
        if (reds.data.errmsg === '成功') {
          that.$message({
            showClose: true,
            message: '编辑成功',
            type: 'success'
          })
          that.show = false
          that.load()
        } else {
          that.$message({
            showClose: true,
            message: reds.data.errmsg,
            type: 'error'
          })
        }
      })
    },
    Export () { // 导出当前页的数据
      const that = this
      import('../../components/Excel.js').then(excel => {
        const header = [
          '优惠券ID',
          '名称',
          '介绍',
          '类型',
          '最低消费',
          '减免金额',
          '每人限领',
          '优惠券数量',
          '剩余数量',
          '状态',
          '使用类目'
        ]
        const title = [
          'id',
          'title',
          'description',
          'type',
          'min',
          'discount',
          'limit',
          'total',
          'surplus',
          'status',
          'cateotry'
        ]
        excel.export_json_to_excel2(
          header, // 表头 必填
          that.tableData.items, // 具体数据 必填
          title,
          '优惠劵'
        )
      })
    }
  }
}
</script>

<style>
</style>

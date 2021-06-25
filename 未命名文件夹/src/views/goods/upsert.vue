<template>
  <div>
    <div style="width: 100%;height: 60px;"></div>
    <el-card class="box-card">
      <h3>商品（Spu）介绍</h3>
      <el-form :model="form" label-width="100px" :rules="spu" ref="form" :show-message="true">
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="原始价格" prop="originalPriceRaw">
          <el-input v-model="form.originalPriceRaw" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="当前价格" prop="priceRaw">
          <el-input v-model="form.priceRaw" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="VIP价格" prop="vipPriceRaw">
          <el-input v-model="form.vipPriceRaw" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="剩余库存" prop="stock">
          <el-input v-model="form.stock" :disabled="true" placeholder="0" />
        </el-form-item>

        <el-form-item label="运费模板" prop="freightTemplateId">
          <el-select v-model="form.freightTemplateId" placeholder="选择商品运费模板">
            <el-option v-for="(item, index) in freight" :key="index" :label="item.freightTemplateDO.templateName"
              :value="item.freightTemplateDO.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否在售" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">在售</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品图片" prop="imgList">
          <el-upload :action="img" :limit="5" :file-list="imgList" :on-exceed="onExceed" :on-success="onSuccess"
            :on-remove="onRemove" multiple accept=".jpg, .jpeg, .png, .gif" list-type="picture-card">
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="商品单位" prop="unit">
          <el-input v-model="form.unit" placeholder="件 / 个 / 盒" />
        </el-form-item>

        <el-form-item label="所属类目" prop="categoryIds">
          <el-cascader :options="categoryList" v-model="form.categoryIds" props.expandTrigger="hover"
            @change="handleCategoryChange" />
        </el-form-item>

        <el-form-item label="商品简介" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>

        <el-form-item label="商品详细介绍" prop="detail">
          <vue-editor v-model="form.detail"></vue-editor>
          <!-- <editor v-model="form.detail"></editor> -->
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <h3>商品类型(sku)</h3>
      <el-button :plain="true" type="primary" @click='skuShow=true'>添加</el-button>
      <el-table :data="form.skuList">
        <el-table-column property="barCode" label="Sku条形码" />
        <el-table-column property="title" label="类型名" />
        <el-table-column property="originalPrice" label="原价">
          <template slot-scope="scope">
            {{scope.row.originalPrice/100}}
          </template>
        </el-table-column>
        <el-table-column property="price" label="现价">
          <template slot-scope="scope">
            {{scope.row.price/100}}
          </template>
        </el-table-column>
        <el-table-column property="vipPrice" label="VIP价">
          <template slot-scope="scope">
            {{scope.row.vipPrice/100}}
          </template>
        </el-table-column>
        <el-table-column property="stock" label="库存" />
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteSku(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加商品类型 -->
      <el-dialog :visible.sync="skuShow" title="添加商品类型（Sku）">
        <el-form :rules="sku" ref="sku" :model="skuForm" status-icon label-position="left" label-width="100px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="类型条码" prop="barCode">
            <el-input v-model="skuForm.barCode" />
          </el-form-item>
          <el-form-item label="类型名称" prop="title">
            <el-input v-model="skuForm.title" />
          </el-form-item>
          <el-form-item label="图片(可空)">
            <el-upload class="avatar-uploader" :action="img" :show-file-list="false" :on-success="uploadSuccessHandle"
              :before-upload="onBeforeUpload">
              <img v-if="skuForm.img" :src="skuForm.img" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="原始价格" prop="originalPrice">
            <el-input v-model="skuForm.originalPrice" placeholder="0.00">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="当前价格" prop="price">
            <el-input v-model="skuForm.price" placeholder="0.00">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="VIP价格" prop="vipPrice">
            <el-input v-model="skuForm.vipPrice" placeholder="0.00">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model="skuForm.stock" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click='skuShow=false'>取消</el-button>
          <el-button type="primary" @click="skuClick">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <el-card class="box-card">
      <h3>商品参数</h3>
      <el-button :plain="true" type="primary" @click="attributE">添加</el-button>
      <el-table :data="form.attributeList">
        <el-table-column property="attribute" label="商品参数名称" />
        <el-table-column property="value" label="商品参数值" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click='deleteAttribute(scope)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="attributeShow" title="设置商品参数">
        <el-form :rules="attribute" ref="attribute" :model="attributeForm" :data="form.attributeList"
          label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="商品参数名称" prop="attribute">
            <el-input v-model="attributeForm.attribute" />
          </el-form-item>
          <el-form-item label="商品参数值" prop="value">
            <el-input v-model="attributeForm.value" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeShow = false">取消</el-button>
          <el-button type="primary" @click="attributeClick">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <div class="box-card">
      <el-button @click="$router.push({path: '/goods/goodslist'})">取消</el-button>
      <el-button type="primary" v-if="router=='创建'" @click="addProduct">添加商品</el-button>
      <el-button type="primary" v-if="router=='编辑'" @click="updateProduct">更新商品</el-button>
    </div>
  </div>
</template>

<script>
import {
  VueEditor
} from 'vue2-editor' // 导入富文本
import {
  freightTemplate,
  detail,
  categoryTree,
  AddProduct,
  UpdateProduct
} from '../../api/goods/upsert.js'
export default {
  components: {
    VueEditor
  },
  data () {
    return {
      imgList: [],
      router: '创建',
      img: 'http://192.168.1.54:8081/upload/admin', // 更改图片的地址
      form: {
        title: '',
        originalPriceRaw: '',
        priceRaw: '',
        vipPriceRaw: '',
        stock: '',
        freightTemplateId: '',
        status: 1,
        unit: '',
        description: '',
        img: '',
        imgList: [],
        detail: '',
        categoryIds: '',
        skuList: [],
        attributeList: []
      },
      freight: [],
      categoryList: [],
      skuShow: false,
      attributeShow: false,
      skuForm: { // 添加商品类型（Sku）
        barCode: '',
        title: '',
        originalPrice: '',
        price: '',
        vipPrice: '',
        stock: '',
        img: ''
      },
      attributeForm: {
        attribute: '',
        value: ''
      },
      spu: {
        title: [{
          required: true,
          message: '商品名称不能为空',
          trigger: 'blur'
        }],
        priceRaw: [{
          required: true,
          message: '商品现价不能为空',
          trigger: 'blur'
        }],
        imgList: [{
          required: true,
          message: '商品图片不能为空',
          trigger: 'blur'
        }],
        categoryIds: [{
          required: true,
          message: '所属类目不能为空',
          trigger: 'blur'
        }],
        freightTemplateId: [{
          required: true,
          message: '运费模板不能为空',
          trigger: 'blur'
        }],
        originalPriceRaw: [{
          required: true,
          message: '商品原价不能为空',
          trigger: 'blur'
        }],
        vipPriceRaw: [{
          required: true,
          message: '商品ViP价格不能为空',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '请选择商品状态',
          trigger: 'blur'
        }],
        unit: [{
          required: true,
          message: '物件单位不能为空',
          trigger: 'blur'
        }],
        detail: [{
          required: true,
          message: '请填写商品详情',
          trigger: 'blur'
        }]
      },
      sku: {
        barCode: [{
          required: true,
          message: '类型条码不能为空',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '类型名称不能为空',
          trigger: 'blur'
        }],
        originalPrice: [{
          required: true,
          message: '原始价格不能为空',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '当前价格不能为空',
          trigger: 'blur'
        }],
        vipPrice: [{
          required: true,
          message: 'VIP价格不能为空',
          trigger: 'blur'
        }],
        stock: [{
          required: true,
          message: '库存不能为空',
          trigger: 'blur'
        }]
      },
      attribute: {
        attribute: [{
          required: true,
          message: '商品参数名称不能为空',
          trigger: 'blur'
        }],
        value: [{
          required: true,
          message: '商品参数值不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      const that = this
      if (that.$route.query.data) {
        if (that.$route.query.data.categoryId) { // 如果有商品ID则为编辑商品
          const data = that.$route.query.data
          that.router = '编辑'
          detail(data.id).then(reds => {
            reds.data.data.priceRaw = reds.data.data.price / 100
            reds.data.data.originalPriceRaw =
                reds.data.data.originalPrice / 100
            reds.data.data.vipPriceRaw = reds.data.data.vipPrice / 100
            that.form = reds.data.data
            that.form.attributes = reds.data.data.attributeList ? reds.data.data.attributeList : []
            that.categoryIds = reds.data.data.categoryIds.reverse()
            that.form.skuList = reds.data.data.skuList
            that.imgList = []
            for (var i = 0; i < that.form.imgList.length; i++) {
              that.imgList.push({
                url: that.form.imgList[i]
              })
            }
            if (that.form.skuList) {
              console.log(that.form.skuList)
              for (var j = 0; j < that.form.skuList.length; j++) {
                that.skuList[j].priceRaw = that.skuList[j].price / 100
                that.skuList[j].originalPriceRaw =
                    that.skuList[j].originalPrice / 100
                that.skuList[j].vipPriceRaw = that.skuList[j].vipPrice / 100
              }
            }
          })
        } else {
          that.router = '创建'
        }
      }
      freightTemplate().then(function (reds) {
        that.freight = reds.data.data
      })
      categoryTree().then(function (reds) {
        that.categoryList = reds.data.data
      })
    },
    onSuccess (e) { // 上传图片
      this.form.imgList.push(e.url)
      this.form.img = this.form.imgList[0]
    },
    onRemove (file) { // 删除上传的图片
      for (var i = 0; i < this.form.imgList.length; i++) {
        var url
        if (file.response === undefined) {
          url = file.url
        } else {
          url = file.response.url
        }
        if (this.form.imgList[i] === url) {
          this.form.imgList.splice(i, 1)
        }
      }
      if (this.form.imgList.length > 0) {
        this.form.img = this.form.imgList[0]
      }
    },
    onExceed (files, fileList) { // 上传内容达到限制后再上传时触发
      this.mess ? this.mess.close() : ''
      this.mess = this.$message({
        showClose: true,
        message: '上传文件个数超出限制!最多上传5张图片!',
        type: 'error'
      })
    },
    handleCategoryChange (value) { // 所属类目发生变化
      this.goods.categoryId = value[value.length - 1]
    },
    deleteSku (scope) { // 删除sku条形码
      const that = this
      that.$confirm(
        '是否删除该sku条形码----' +
          that.form.skuList[scope.$index].barCode +
          '----, 是否继续?',
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
        that.form.skuList.splice(scope.$index, 1)
      })
    },
    deleteAttribute (scope) { // 删除商品参数
      const that = this
      that.$confirm(
        '是否删除该商品参数----' +
          that.form.attributeList[scope.$index].value +
          '----, 是否继续?',
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
        that.form.attributeList.splice(scope.$index, 1)
      })
    },
    onBeforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadSuccessHandle (e) { // 上传图片
      this.skuForm.img = e.url
    },
    skuClick () { // 添加sku条形码
      this.$refs.sku.validate((valid) => {
        if (valid) {
          this.form.skuList.push(this.skuForm)
          this.skuShow = false
        } else {
          that.mess ? that.mess.close() : ''
          that.mess = that.$message({
            showClose: true,
            message: '请完善表单',
            type: 'error'
          })
        }
      })
    },
    attributE () { // 点击添加商品参数
      this.attributeShow = true
      this.attributeForm = {
        attribute: '',
        value: ''
      }
    },
    attributeClick () { // 添加商品参数
      this.$refs.attribute.validate((valid) => {
        if (valid) {
          this.attributeShow = false
          this.form.attributeList.push(this.attributeForm)
        } else {
          that.mess ? that.mess.close() : ''
          that.mess = that.$message({
            showClose: true,
            message: '请完善表单',
            type: 'error'
          })
        }
      })
    },
    addProduct () { // 添加商品
      const that = this
      if (that.form.skuList.length != 0) {
        that.$refs.form.validate((valid) => {
          if (valid) {
            that.form.categoryId = that.form.categoryIds[2]
            that.form.price = parseInt(that.form.priceRaw * 100)
            that.form.originalPrice = parseInt(that.form.originalPriceRaw * 100)
            that.form.vipPrice = parseInt(that.form.vipPriceRaw * 100)
            that.form.skuList.priceRaw = parseInt(that.form.skuList.price * 100)
            that.form.skuList.originalPriceRaw = parseInt(that.form.skuList.originalPrice * 100)
            that.form.skuList.vipPriceRaw = parseInt(that.form.skuList.vipPrice * 100)
            that.form.attribute = that.form.attributeList
            AddProduct(JSON.stringify(that.form)).then(function (reds) {
              if (reds.data.errmsg == '成功') {
                that.$router.push({
                  path: '/goods/goodslist'
                })
                that.mess ? that.mess.close() : ''
                that.mess = that.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
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
              message: '请完善表单',
              type: 'error'
            })
          }
        })
      } else {
        that.mess ? that.mess.close() : ''
        that.mess = that.$message({
          showClose: true,
          message: '商品类型至少有一条数据',
          type: 'error'
        })
      }
    },
    updateProduct () { // 更新商品
      const that = this
      if (that.form.skuList.length != 0) {
        that.$refs.form.validate((valid) => {
          if (valid) {
            that.form.categoryId = that.form.categoryIds[2]
            that.form.price = parseInt(that.form.priceRaw * 100)
            that.form.originalPrice = parseInt(that.form.originalPriceRaw * 100)
            that.form.vipPrice = parseInt(that.form.vipPriceRaw * 100)
            that.form.skuList.priceRaw = parseInt(that.form.skuList.price * 100)
            that.form.skuList.originalPriceRaw = parseInt(that.form.skuList.originalPrice * 100)
            that.form.skuList.vipPriceRaw = parseInt(that.form.skuList.vipPrice * 100)
            UpdateProduct(JSON.stringify(that.form)).then(function (reds) {
              if (reds.data.errmsg == '成功') {
                that.$router.push({
                  path: '/goods/goodslist'
                })
                that.mess ? that.mess.close() : ''
                that.mess = that.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
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
              message: '请完善表单',
              type: 'error'
            })
          }
        })
      } else {
        that.mess ? that.mess.close() : ''
        that.mess = that.$message({
          showClose: true,
          message: '商品类型至少有一条数据',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style>
  .box-card {
    width: 95%;
    margin: auto;
    margin-top: 20px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<template>
  <div>
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :fileList="fileList"
      :http-request="upload"
      :limit="1"
      :class="{ completed: isComputed }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      v-if="showProgress"
      :percentage="percentage"
      style="width: 180px"
    ></el-progress>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
// 需要实例化
const cos = new COS({
  SecretId: "AKIDIQJvHMBj01lDOIvHM9gwvd4F8k59wShf",
  SecretKey: "i8HAl5TaQzHH1TeYBXcQwCArHSLxINAg",
});

export default {
  data() {
    return {
      showProgress: false,
      percentage: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [
        {
          url: "https://tse3-mm.cn.bing.net/th/id/OIP-C.8olSEek1RZjSQDgPizhxEAHaJ3?pid=ImgDet&rs=1",
        },
      ],
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("文件类型不匹配");
        return false;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("文件太大了");
        return false;
      }
      this.showProgress = true;
      // return true;
    },
    // 进行上传操作
    upload(params) {
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: "2457012-1313213561", // 存储桶
            Region: "ap-nanjing", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: ({ percent }) => {
              this.percentage = percent * 100;
            },
          },
          (err, data) => {
            if (err) {
              return this.$message.error(err?.message || "上传出错");
            }
            this.fileList.forEach((item) => {
              if (item.uid === params.file.uid) {
                item.url = `http://${data.Location}`;
                item.upload = true;
              }
              return item;
            });
            this.showProgress = false;
            this.percentage = 0;
          }
        );
      }
    },
  },
  computed: {
    isComputed() {
      return this.fileList.length === 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>

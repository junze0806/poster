const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avater: { // 背景图片
      type: String,
      value: ''
    },
    productname: { // 名称
      type: String,
      value: ''
    },
    codeimg: { // 二维码
      type: String,
      value: ''
    },
    date: { //日期
      type: String,
      value: ''
    },
    contentImg: { //主图
      type: String,
      value: ''
    },
    contentText: { //描述
      type: String,
      value: ''
    },
    details: { //详情
      type: String,
      value: ''
    },
    rule: { //详情
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    productCode: "",
    showpost: false,
    imgHeight: 0,
    productCode: "", //二维码
    width: ''
  },

  ready: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //下载产品图片
    getAvaterInfo: function () {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      that.setData({
        showpost: true
      })
      var productImage = that.data.avater;
      if (productImage) {
        // 本地背景图
        var productSrc = productImage;
        that.calculateImg(productSrc, function (data) {
          that.getQrCode(productSrc, data);
        })
        // 线上背景图
        // wx.downloadFile({
        //   url: productImage,
        //   success: function(res) {
        //     wx.hideLoading();
        //     if (res.statusCode === 200) {
        //       console.log(res.tempFilePath)
        //       var productSrc = res.tempFilePath;
        //       that.calculateImg(productSrc, function(data) {
        //         that.getQrCode(productSrc, data);
        //       })
        //     } else {
        //       wx.showToast({
        //         title: '产品图片下载失败！',
        //         icon: 'none',
        //         duration: 2000,
        //         success: function() {
        //           var productSrc = "";
        //           that.getQrCode(productSrc);
        //         }
        //       })
        //     }
        //   }
        // })
      } else {
        wx.hideLoading();
        var productSrc = "";
        that.getQrCode(productSrc);
      }
    },

    //下载二维码
    getQrCode: function (productSrc, imgInfo = "") {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      var productCode = that.data.codeimg;
      if (productCode) {
        wx.downloadFile({
          url: productCode,
          success: function (res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
            } else {
              wx.showToast({
                title: '二维码下载失败！',
                icon: 'none',
                duration: 2000,
                success: function () {
                  var codeSrc = "";
                  that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var codeSrc = "";
        that.sharePosteCanvas(productSrc, codeSrc);
      }
    },

    //canvas绘制分享海报
    sharePosteCanvas: function (avaterSrc, codeSrc, imgInfo) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      })
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      const query = wx.createSelectorQuery().in(this);
      query.select('#canvas-container').boundingClientRect(function (rect) {
        var height = rect.height;
        var right = rect.right;
        that.setData({
          width: rect.width
        })
        var left = rect.left;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width, height);

        //头像
        if (avaterSrc) {
          if (imgInfo) {
            that.setData({
              imgheght: parseFloat(imgInfo)
            })
          }
          ctx.drawImage(avaterSrc, 0, 0, that.data.width, that.data.imgheght ? that.data.imgheght : that.data.width);
          ctx.setFontSize(14);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('left');
        }


        //日期
        if (that.data.date) {
          ctx.setFillStyle('#F57509');
          var year = that.data.date.split('-')[0]
          var day = that.data.date.split('-')[1] + '/' + that.data.date.split('-')[2]
          ctx.setFontSize(23);
          ctx.fillText(year, 327, that.data.imgheght - 37); //年
          ctx.setFontSize(18);
          ctx.fillText(day, 329, that.data.imgheght - 61); //月日
        }


        //  绘制二维码
        if (codeSrc) {
          ctx.drawImage(codeSrc, that.data.width / 2 - (that.data.width / 4) / 2, that.data.imgheght - 90, that.data.width / 4, that.data.width / 4)
          ctx.setFontSize(10);
          ctx.setFillStyle('#000');
        }

        //绘制详情
        if (that.data.details) {
          ctx.save();
          ctx.setFillStyle('#f7f7f7')
          ctx.fillRect(that.data.width / 2 - 150, 620, 300, 100)
          ctx.setFontSize(11);
          ctx.setFillStyle('#333333');
          let config = {
            left: that.data.width / 2 - 143,
            top: (that.data.imgheght / 2 + 185),
            width: 290,
            lineHight: 16
          }
          that.changeText(that.data.details, 275, ctx, config)
          ctx.fill()
          ctx.clip();
          ctx.restore();
        }

        //绘制主图
        if (that.data.contentImg) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(that.data.width / 2, 430, 130, 0, 2 * Math.PI)
          ctx.fill()
          ctx.clip();
          ctx.drawImage(that.data.contentImg, that.data.width / 2 - 150, 260, 300, 300);
          ctx.restore();
        }
        //绘制描述
        if (that.data.contentText) {
          ctx.setFontSize(19);
          ctx.setFillStyle('#ffa528');
          let config = {
            left: that.data.width / 2 - 150,
            top: (that.data.imgheght / 2 + 130),
            width: 300,
            lineHight: 23
          }
          that.changeText(that.data.contentText, 300, ctx, config)
        }

        //绘制规则
        if (that.data.rule) {
          let rule = JSON.parse(that.data.rule)
          ctx.setFontSize(11);
          ctx.setFillStyle('#333333');
          ctx.fillText('活动时间：', that.data.width / 5.5, 740);
          ctx.fillText('活动地址：', that.data.width / 5.5, 760);

          ctx.fillText('活动人数：', that.data.width / 1.6, 740);
          ctx.fillText('活动对象：', that.data.width / 1.6, 760);

          ctx.setFillStyle('#ffa528');
          ctx.fillText(rule.time, that.data.width / 5.5 + 45, 740);
          ctx.fillText(rule.address, that.data.width / 5.5 + 45, 760);

          ctx.fillText(rule.num, that.data.width / 1.6 + 45, 740);
          ctx.fillText(rule.object, that.data.width / 1.6 + 45, 760);
          ctx.setTextAlign('left')
        }
      }).exec()
      setTimeout(function () {
        ctx.draw();
        wx.hideLoading();
      }, 1000)

    },
    changeText(tet, num, ctx, config) {
      let that = this;
      let answer = that.textByteLength(tet, num, ctx)
      for (let i = 0; i < answer.length; i++) {
        setText(i)
      }

      function setText(i) {
        ctx.fillText(answer[i], config.left, config.top + i * config.lineHight, config.width);
        ctx.setTextAlign('left')
      }
    },

    textByteLength(text, num, ctx) { // text为传入的文本  num为单行显示的字节长度
      var chr = text.split(""); //这个方法是将一个字符串分割成字符串数组
      var temp = "";
      var row = [];
      for (var a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < num) {
          temp += chr[a];
        } else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
        }
      }
      row.push(temp);
      return row
    },

    //点击保存到相册
    saveShareImg: function () {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function (res) {
            wx.hideLoading();
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                wx.showModal({
                  content: '图片已保存到相册，赶紧晒一下吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function (res) {
                    that.closePoste();
                    if (res.confirm) { }
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail: function (err) {
            console.log(err)
          }
        }, that);
      }, 1000);
    },
    //关闭海报
    closePoste: function () {
      this.setData({
        showpost: false
      })
      // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', {
        showVideo: true
      })
    },

    //计算图片尺寸
    calculateImg: function (src, cb) {
      var that = this;
      wx.getImageInfo({
        src: src,
        success(res) {
          wx.getSystemInfo({
            success(res2) {
              var imgHeight = res.height;
              console.log(imgHeight)
              that.setData({
                imgHeight: imgHeight / 3 + 100
              })
              cb(imgHeight / 3 + 100);
            }
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    }
  }
})
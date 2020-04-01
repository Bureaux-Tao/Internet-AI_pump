// pages/calibration/calibration.js
const scui = require('../../utils/dist/sc-ui');
var judgefirst=false
var judgesecond=false

Page({

    /**
     * 页面的初始数据
     */
    data: {
        snackBar: null,
        first:0,
        second:0,
        third:0,
        runButtonDisabled: true,
        coefficient:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.data.snackBar = scui.SnackBar("#snackbar");
        this.openSnackBar()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    openSnackBar() {
        this.data.snackBar.open({
            message: '请用精准天平和蒸馏水进行校准，校准前请先设置好流速',   //内容
            buttonText: '知道了',           //右侧button的内容，不提供不显示button
            // buttonTextColor:'red',    // button内容的颜色
            // color:'white',        // snackbar的背景颜色
            // messageColor:'black',     // 内容的颜色
            closeOnButtonClick: true,     // 是否点击button关闭snackbar

            onButtonClick: () => {
                console.log('点击button');
            },
            onOpen: () => {
                console.log('snackBar打开中');
            },
            onOpened() {
                console.log('snackBar已打开');
            },
            onClose() {
                console.log('snackBar关闭中');
            },
            onClosed() {
                console.log('snackBar已关闭');
            }
        });
    },

    getfirst:function(e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        var first = parseFloat(e.detail.value).toFixed(3)
        if (first == 'NaN') {
            this.setData({
                runButtonDisabled: true
            })
            judgefirst = false
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持999.999,精度将会保留3位小数',
                showCancel: false
            })
        } else if (first >= 1000 || first == 0) {
            judgefirst = false
            this.setData({
                runButtonDisabled: true
            })
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持999.999,精度将会保留3位小数',
                showCancel: false
            })
        } else {
            this.setData({
                first: first
            })
            judgefirst = true
            this.calculate()
            if (judgefirst == true && judgesecond == true) {
                this.setData({
                    runButtonDisabled: false,
                })
            }
        }
    },

    firstSliderEvent:function(e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        this.setData({
            first: parseFloat(e.detail.value).toFixed(3)
        })
        judgefirst = true
        if (e.detail.value==0) {
            judgefirst = false
            this.setData({
                runButtonDisabled: true
            })
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持999.999,精度将会保留3位小数',
                showCancel: false
            })
            return 
        }
        this.calculate()
        if (judgefirst == true && judgesecond == true) {
            this.setData({
                runButtonDisabled: false,
            })
        }
    },

    getsecond: function (e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        var second = parseFloat(e.detail.value).toFixed(3)
        if (second == 'NaN') {
            this.setData({
                runButtonDisabled: true
            })
            judgesecond = false
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持999.999,精度将会保留3位小数',
                showCancel: false
            })
        } else if (second >= 1000 || second == 0) {
            judgesecond = false
            this.setData({
                runButtonDisabled: true
            })
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持999.999,精度将会保留3位小数',
                showCancel: false
            })
        } else {
            this.setData({
                second: second
            })
            judgesecond = true
            this.calculate()
            if (judgefirst == true && judgesecond == true) {
                this.setData({
                    runButtonDisabled: false,
                })
            }
        }
    },

    secondSliderEvent: function (e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        this.setData({
            second: parseFloat(e.detail.value).toFixed(3)
        })
        judgesecond = true
        if (e.detail.value==0) {
            judgesecond = false
            this.setData({
                runButtonDisabled: true
            })
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持999.999,精度将会保留3位小数',
                showCancel: false
            })
            return 
        }
        this.calculate()
        if (judgefirst == true && judgesecond == true) {
            this.setData({
                runButtonDisabled: false,
            })
        }
    },

    toRight:function() {
        console.log('Go')
        var passCalibration= {
            first:this.data.first,
            second:this.data.second,
            third:this.data.coefficient
        }
        console.log(passCalibration);
    },

    calculate:function() {
        if(judgesecond==true) {
            var temp=parseFloat( this.data.first/this.data.second).toFixed(3)
            this.setData({
                coefficient:temp
            })
        }
    },

    toRight:function(){
        wx.switchTab({
            url: '../index/index',
        })
    }
})
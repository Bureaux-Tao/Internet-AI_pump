//index.js
//获取应用实例
const app = getApp()
const scui = require('../../utils/dist/sc-ui');
var maxSpeed=999.999
const FACTOR=3.117
var judgeDiameter=false
var judgeCapital=false
var judgeSpeed=false

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mode:'单推',
        single_push_class: "neon",
        single_pull_class: "toggle--btn",
        runButtonDisabled:true,
        diameter:0,
        capital:0,
        speed:0,
        capitalRange:['mL','μL'],
        capitalUnit:'mL',
        speedPickerRange: [['mL', 'μL'],['sec','min','hour']],
        speedUnit1:'mL',
        speedUnit2:'sec',
        Maxspeed:999.999
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    Switch: function(e) {
        if (e.currentTarget.dataset.mode=='single_push') {
            console.log(e.currentTarget.dataset.mode);
            this.setData ({
                single_push_class: "neon",
                single_pull_class: "toggle--btn",
                mode:'单推'
            })
        } else {
            console.log(e.currentTarget.dataset.mode);
            this.setData({
                single_pull_class: "neon",
                single_push_class: "toggle--btn",
                mode: '单拉'
            })
        }
    },

    toLeft:function() {
        console.log("left");
        wx.switchTab({
            url: '../calibration/calibration',
        })
    },

    toRight:function() {
        var that=this
        console.log("right");
        wx.getStorage({
            key: 'isRunning',
            success: function(res) {
                if(res.data==true) {
                    wx.showModal({
                        title: '注射器正在工作中',
                        content: '如需更改数据,请先在运行界面暂停注射器',
                        showCancel:false,
                        success:(res)=>{
                            return
                        }
                    })
                } else {
                    wx.showModal({
                        title: '确定更改数据',
                        content: '更改后数据将覆盖当前数据,此操作不可逆转',
                        success:(res)=>{
                            if (res.cancel == true) {
                                return
                            } if (res.confirm == true) {
                                var passData = {
                                    mode: that.data.mode,
                                    diameter: that.data.diameter,
                                    capital: that.data.capital,
                                    capitalUnit: that.data.capitalUnit,
                                    speed: that.data.speed,
                                    speedUnit1: that.data.speedUnit1,
                                    speedUnit2: that.data.speedUnit2
                                }
                                console.log(passData);
                                wx.setStorage({
                                    key: 'passData',
                                    data: passData,
                                })
                                wx.setStorage({
                                    key: 'hasInit',
                                    data: false,
                                })
                                wx.switchTab({
                                    url: '../run/run'
                                })
                            }
                        }
                    })
                } 
            },
        })
    },

    getDiameter:function(e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        var diameter = parseFloat(e.detail.value).toFixed(3)
        if(diameter=='NaN') {
            this.setData({
                runButtonDisabled:true
            })
            judgeDiameter=false
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持999.999,精度将会保留3位小数',
                showCancel: false
            })
        } else if(diameter>=1000||diameter==0) {
            judgeDiameter=false
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
                diameter: diameter
            })
            judgeDiameter = true
            this.speedJudge()
            if (judgeCapital == true && judgeDiameter == true && judgeSpeed == true) {
                this.setData({
                    runButtonDisabled: false,
                    diameter:diameter
                })
            }
        }
    },

    getCapital: function (e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        var capital = parseFloat(e.detail.value).toFixed(3)
        if (capital == 'NaN') {
            judgeCapital=false
            this.setData({
                runButtonDisabled: true
            })
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持999.999,精度将会保留3位小数',
                showCancel: false
            })
        } else if (capital >= 1000||capital==0) {
            judgeCapital=false
            this.setData({
                runButtonDisabled: true
            })
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持999.999,精度将会保留3位小数',
                showCancel: false
            })
        } else {
            judgeCapital = true
            this.setData({
                capital:capital
            })
            if (judgeCapital == true && judgeDiameter == true && judgeSpeed == true){
                this.setData({
                    runButtonDisabled: false,
                    capital: capital
                })
            }
        }
    },

    getSpeed: function (e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        var diameter=this.data.diameter
        var speed = parseFloat(e.detail.value).toFixed(3)
        var factor=FACTOR*diameter*diameter
        //计算MaxSpeed
        if (this.data.speedUnit1=='mL' && this.data.speedUnit2== 'sec') {
            maxSpeed=factor/1000
        } else if (this.data.speedUnit1 == 'mL' && this.data.speedUnit2 == 'min') {
            maxSpeed=factor/1000*60
        } else if (this.data.speedUnit1 == 'mL' && this.data.speedUnit2 == 'hour') {
            maxSpeed=factor/1000*3600
        } else if (this.data.speedUnit1 == 'μL' && this.data.speedUnit2 == 'sec') {
            maxSpeed=factor
        } else if (this.data.speedUnit1 == 'μL' && this.data.speedUnit2 == 'min') {
            maxSpeed=factor*60
        } else {
            maxSpeed=factor*3600
        }
        console.log("MaxSpeed:"+maxSpeed);
        this.setData({
            Maxspeed:maxSpeed
        })
        //计算MaxSpeed
        if (speed == 'NaN') {
            judgeSpeed=false
            this.setData({
                runButtonDisabled: true
            })
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持' +parseFloat(maxSpeed).toFixed(3)+',精度将会保留3位小数',
                showCancel: false
            })
        } else if (speed >= maxSpeed||speed==0) {
            judgeSpeed=false
            this.setData({
                runButtonDisabled: true
            })
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持' + parseFloat(maxSpeed).toFixed(3) + ',精度将会保留3位小数',
                showCancel: false
            })
        } else {
            judgeSpeed=true
            this.setData({
                speed:speed
            })
            if(judgeCapital==true&&judgeDiameter==true&&judgeSpeed==true) {
                this.setData({
                    runButtonDisabled: false,
                    speed: speed
                })
            }
        }
    },

    capitalPickerEvent:function(e) {
        console.log(e.detail.value);
        if (e.detail.value=='0') {
            this.setData({
                capitalUnit:'mL'
            })
        } else {
            this.setData({
                capitalUnit:'μL'
            })
        }
    },

    speedPickerEvent:function(e) {
        // console.log(e.detail.value);
        console.log(e.detail.value[0]);
        console.log(e.detail.value[1]);
        if (e.detail.value[0]==0) {
            this.setData({
                speedUnit1:'mL'
            })
        } else {
            this.setData({
                speedUnit1:'μL'
            })
        }
        if (e.detail.value[1]==0) {
            this.setData({
                speedUnit2:'sec'
            })
        } else if (e.detail.value[1] ==1) {
            this.setData({
                speedUnit2:'min'
            })
        } else {
            this.setData({
                speedUnit2:'hour'
            })
        }
        if (this.data.speed>this.speedJudge()) {
            wx.showModal({
                title: '请重新设定流速',
                content: '最大支持' + parseFloat(maxSpeed).toFixed(3) + ',精度将会保留3位小数',
                showCancel: false
            })
            this.setData({
                runButtonDisabled: true
            })
        }
    },

    speedJudge:function() {
        var MaxSpeed
        var diameter = this.data.diameter
        var factor = FACTOR * diameter * diameter
        //计算MaxSpeed
        if (this.data.speedUnit1 == 'mL' && this.data.speedUnit2 == 'sec') {
            MaxSpeed = factor / 1000
        } else if (this.data.speedUnit1 == 'mL' && this.data.speedUnit2 == 'min') {
            MaxSpeed = factor / 1000 * 60
        } else if (this.data.speedUnit1 == 'mL' && this.data.speedUnit2 == 'hour') {
            MaxSpeed = factor / 1000 * 3600
        } else if (this.data.speedUnit1 == 'μL' && this.data.speedUnit2 == 'sec') {
            MaxSpeed = factor
        } else if (this.data.speedUnit1 == 'μL' && this.data.speedUnit2 == 'min') {
            MaxSpeed = factor * 60
        } else {
            MaxSpeed = factor * 3600
        }
        console.log("MaxSpeed:" + MaxSpeed);
        maxSpeed=MaxSpeed
        this.setData({
            Maxspeed:MaxSpeed
        })
        return MaxSpeed
        //计算MaxSpeed
    },

    diameterSliderEvent:function(e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        this.setData({
            diameter: parseFloat(e.detail.value).toFixed(3)
        })
        this.speedJudge()
        judgeDiameter=true
        if (e.detail.value==0) {
            judgeDiameter = false
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
        if (judgeCapital == true && judgeDiameter == true && judgeSpeed == true) {
            this.setData({
                runButtonDisabled: false,
            })
        }
    },

    capitalSliderEvent: function (e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        this.setData({
            capital: parseFloat(e.detail.value).toFixed(3)
        })
        judgeCapital=true
        if (e.detail.value==0) {
            judgeCapital = false
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
        if (judgeCapital == true && judgeDiameter == true && judgeSpeed == true) {
            this.setData({
                runButtonDisabled: false,
            })
        }
    },

    speedSliderEvent:function(e) {
        console.log(parseFloat(e.detail.value).toFixed(3));
        this.setData({
            speed: parseFloat(e.detail.value).toFixed(3)
        })
        judgeSpeed=true
        if (e.detail.value==0) {
            judgeSpeed = false
            this.setData({
                runButtonDisabled: true
            })
            wx.showModal({
                title: '输入错误',
                content: '请重新输入,最大支持' + parseFloat(maxSpeed).toFixed(3) + ',精度将会保留3位小数',
                showCancel: false
            })
        }
        if (judgeCapital == true && judgeDiameter == true && judgeSpeed == true) {
            this.setData({
                runButtonDisabled: false,
            })
        }
    }

})
// pages/run/run.js
var timer = require('../../utils/wxTimer.js');
const app = getApp()
var wxTimer
Page({

    /**
     * 页面的初始数据
     */
    data: {
        vary_width: wx.getSystemInfoSync().windowWidth * 0.85,
        warningFont:'#FF4A4A',
        mode: '',
        diameter: 0,
        capital: '0',
        capitalUnit: '',
        speed: '',
        speedUnit1: '',
        speedUnit2: '',
        remainingSeconds:0,
        remainingSecondsString: "00:00:00",
        runningSeconds: 0,
        runningSecondsString:"00:00:00",
        totalTimeString:'00:00:00',
        totalTimeNumber:0,
        hasShot:0,
        remain:0,
        wxTimerList: {},
        showRing:0,
        canRun:true,
        canPause:true,
        state:'待设置',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.canvasRing = that.selectComponent("#canvasRing");
        that.canvasRing.showCanvasRing();
        // that.getData()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        that.canvasRing = that.selectComponent("#canvasRing");
        that.canvasRing.showCanvasRing();
        wx.getStorage({
            key: 'hasInit',
            success: function(res) {
                if(res.data!=true) {
                    that.getData()
                }
            },
        })
        wx.setStorage({
            key: 'hasInit',
            data: true,
        })
        
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

    getQueryBean:function() {
        var that=this
        wx.getStorage({
            key: 'passData',
            success: function(res) {
                console.log(res.data);
                that.setData({
                    mode: res.data.mode,
                    diameter: res.data.diameter,
                    capital: res.data.capital,
                    capitalUnit: res.data.capitalUnit,
                    speed: res.data.speed,
                    speedUnit1: res.data.speedUnit1,
                    speedUnit2: res.data.speedUnit2
                })
            },
        })
    },

    run:function() {
        wx.getStorage({
            key: 'isRunning',
            success: function(res) {
                console.log(res.data)
                if(res.data!=false) {
                    return 
                }
            },
        })
        
        wx.setStorage({
            key: 'isRunning',
            data: true,
        })

        wx.showModal({
            title: '确认开始',
            content: '可以关闭小程序,但是请不要将微信从后台关闭',
            success:(res)=>{
                // console.log(res);
                this.setData({
                    canRun:true,
                    canPause:false,
                    state:'运行中'
                })
                if(res.confirm==true) {
                    console.log("start");
                    var beginTime = this.data.remainingSecondsString
                    var that = this
                    wxTimer = new timer({
                        beginTime: beginTime,
                        complete: function () {
                            console.log("完成了")
                        },
                        interval: 1,
                        intervalFn: function () {
                            var s = that.data.remainingSeconds
                            s = s - 1
                            if (s == 0) {
                                wxTimer.stop();
                                console.log("完成了")
                                wx.vibrateLong({
                                    success:(res)=> {
                                        console.log("震你妈的");
                                    }
                                })
                                wx.showModal({
                                    title: '成功',
                                    content: '注射已经全部完成。如果还需注射,请返回后重新点击确认',
                                    success:(res)=> {
                                        wx.setStorage({
                                            key: 'isRunning',
                                            data: false,
                                        })
                                    }
                                })
                            }
                            that.setData({
                                remainingSeconds: s,
                                remainingSecondsString: that.formatTime(s)
                            })
                            that.setData({
                                runningSeconds: that.data.totalTimeNumber - that.data.remainingSeconds,
                                runningSecondsString: that.formatTime(parseInt(that.data.totalTimeNumber - that.data.remainingSeconds)),
                            })
                            that.calculateRemainingCapacity()
                            that.setData({
                                showRing: parseInt((that.data.runningSeconds / that.data.totalTimeNumber) * 100)
                            })
                            that.canvasRing.showCanvasRing()
                        }
                    })
                    wxTimer.start(this);
                } else {
                    wx.setStorage({
                        key: 'isRunning',
                        data: false,
                    })
                }
            }
        })
    },

    pause:function() {
        wx.getStorage({
            key: 'isRunning',
            success: function (res) {
                console.log(res.data);
                if (res.data == true) {
                    return
                } 
            },
        })
        console.log("pause");
        this.setData({
            canRun:false,
            canPause:true,
            state:'暂停'
        })
        wxTimer.stop();
        wx.setStorage({
            key: 'isRunning',
            data: false,
        })
        
    },

    back:function() {
        console.log("back");
        wx.switchTab({
            url: '../index/index',
        })
    },

    calculateTime:function() {
        var v=this.data.speed
        var u=this.data.capital
        var v_l=this.data.capitalUnit
        var u_l1=this.data.speedUnit1
        var u_l2=this.data.speedUnit2
        if(v_l=='mL') {
            u=u*1000
        }
        if(u_l1=='mL') {
            v=v*1000
        }
        if(u_l2=='min') {
            v=v/60
        } else if(u_l2=='hour') {
            v=v/3600
        }
        console.log('u:' + u);
        console.log('v:' + v);
        console.log('u/v:'+u/v);

        return u/v
    },

    getData:function() {
        wx.showLoading({
            title: '玩命计算中',
        })
        wx.setStorage({
            key: 'isRunning',
            data: false,
        })
        this.setData({
            canRun: false,
            canPause: true
        })
        setTimeout(() => {
            this.getQueryBean()
            this.setData({
                showRing: 0,
                state:'就绪'
            })
            this.canvasRing.showCanvasRing()
            setTimeout(() => {
                this.setData({
                    totalTimeNumber: parseInt(this.calculateTime())

                })
                this.setData({
                    totalTimeString: this.formatTime(this.data.totalTimeNumber),
                })
                this.setData({
                    remainingSeconds: parseInt(this.calculateTime()),
                    remainingSecondsString: this.formatTime(parseInt(this.calculateTime()))
                })
                this.setData({
                    runningSeconds: this.data.totalTimeNumber - this.data.remainingSeconds,
                    runningSecondsString: this.formatTime(parseInt(this.data.totalTimeNumber - this.data.remainingSeconds))
                })
                this.calculateRemainingCapacity()
                wx.hideLoading()
                console.log(this.formatTime( this.data.remainingSeconds));
            }, 500)
        }, 500)
    },

    formatTime:function(seconds) {
        if(seconds<60) {
            if (String(seconds)>=10) {
                return '00:00:' + parseInt(String(seconds))
            } else {
                return '00:00:0' + parseInt(String(seconds))
            }
        } else if(seconds>=60&&seconds<3600) {
            if ((seconds / 60) >= 10 && (seconds % 60)>=10) {
                return '00:' + parseInt(String(seconds / 60)) + ':' + parseInt(String(seconds%60))
            } else if ((seconds / 60) < 10 && (seconds % 60) >= 10) {
                return '00:0' + parseInt(String(seconds / 60)) + ':' + parseInt(String(seconds % 60))
            } else if ((seconds / 60) >= 10 && (seconds % 60) < 10) {
                return '00:' + parseInt(String(seconds / 60)) + ':0' + parseInt(String(seconds % 60))
            } else {
                return '00:0' + parseInt(String(seconds / 60)) + ':0' + parseInt(String(seconds % 60))
            }
        } else {
            if ((String(seconds / 3600)) >= 10 && (String((seconds % 3600) / 60))>=10 && (String((seconds % 3600) % 60)>=10)) {
                return parseInt(String(seconds / 3600)) + ':' + parseInt(String((seconds % 3600) / 60)) + ':' + parseInt(String((seconds % 3600) % 60))
            } else if ((String(seconds / 3600)) >= 10 && (String((seconds % 3600) / 60)) >= 10 && (String((seconds % 3600) % 60) < 10)) {
                return parseInt(String(seconds / 3600)) + ':' + parseInt(String((seconds % 3600) / 60)) + ':0' + parseInt(String((seconds % 3600) % 60))
            } else if ((String(seconds / 3600)) >= 10 && (String((seconds % 3600) / 60)) < 10 && (String((seconds % 3600) % 60) >= 10)) {
                return parseInt(String(seconds / 3600)) + ':0' + parseInt(String((seconds % 3600) / 60)) + ':' + parseInt(String((seconds % 3600) % 60))
            } else if ((String(seconds / 3600)) < 10 && (String((seconds % 3600) / 60)) >= 10 && (String((seconds % 3600) % 60) >= 10)) {
                return '0' + parseInt(String(seconds / 3600)) + ':' + parseInt(String((seconds % 3600) / 60)) + ':' + parseInt(String((seconds % 3600) % 60))
            } else if ((String(seconds / 3600)) < 10 && (String((seconds % 3600) / 60)) < 10 && (String((seconds % 3600) % 60) >= 10)) {
                return '0' + parseInt(String(seconds / 3600)) + ':0' + parseInt(String((seconds % 3600) / 60)) + ':' + parseInt(String((seconds % 3600) % 60))
            } else if ((String(seconds / 3600)) < 10 && (String((seconds % 3600) / 60)) >= 10 && (String((seconds % 3600) % 60) < 10)) {
                return '0' + parseInt(String(seconds / 3600)) + ':' + parseInt(String((seconds % 3600) / 60)) + ':0' + parseInt(String((seconds % 3600) % 60))
            } else if ((String(seconds / 3600)) >= 10 && (String((seconds % 3600) / 60)) < 10 && (String((seconds % 3600) % 60) < 10)) {
                return parseInt(String(seconds / 3600)) + ':0' + parseInt(String((seconds % 3600) / 60)) + ':0' + parseInt(String((seconds % 3600) % 60))
            } else if ((String(seconds / 3600)) < 10 && (String((seconds % 3600) / 60)) < 10 && (String((seconds % 3600) % 60) < 10)) {
                return '0' + parseInt(String(seconds / 3600)) + ':0' + parseInt(String((seconds % 3600) / 60)) + ':0' + parseInt(String((seconds % 3600) % 60))
            }
        }
    },

    calculateRemainingCapacity:function() {
        var v = this.data.speed
        var v_l = this.data.capitalUnit
        var u_l1 = this.data.speedUnit1
        var u_l2 = this.data.speedUnit2
        if(u_l1=='mL') {
            v=v*1000
        } 
        if(u_l2=='min') {
            v=v/60
        } else if(u_l2=='hour') {
            v=v/3600
        }
        var runningTime=this.data.runningSeconds
        var hasShot=runningTime*v
        var remain
        if(v_l=='mL') {
            hasShot=parseFloat(hasShot/1000).toFixed(3)
            remain=parseFloat(this.data.capital-hasShot).toFixed(3)
        } else {
            hasShot = parseFloat(hasShot).toFixed(3)
            remain = parseFloat(this.data.capital - hasShot).toFixed(3)
        }
        // console.log('remain'+remain);
        this.setData({
            hasShot:hasShot+this.data.capitalUnit,
            remain: remain + this.data.capitalUnit
        })
    }
})
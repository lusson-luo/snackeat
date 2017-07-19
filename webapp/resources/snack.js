var gameCanvas = {};

var snack = new Object({
    sn: [
        [2, 4]
    ],
    /*存蛇移动坐标的二维数组*/
    moveOps: [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1]
    ],
    foodPos: [3, 4],
    /*食物坐标*/
    nextMove: [1, 0],
    /*蛇下一步爬行操作*/
    keyCode: 39,
    /*键盘按键*/
    headPos: undefined,
    /*蛇头坐标*/
    lastHeadPos: [2, 4],
    /*上一个头坐标*/
    points: -1,
    /*积分*/
    runStatus: true,
    /* 运行状态，true:运行,false:暂停 */
    timer: undefined,
    /*定时器*/
    lifeStatus: true,
    /*生死状态*/
    startAngle: 0,
    /*开始角度*/
    endAngle: 0,
    /*结束角度*/
    allfoodColor: ["#DDA0DD", "#DB7093", "#D1EEEE", "#B4EEB4"],
    /*所有食物颜色*/
    foodColor: "#FF6666",
    /*当前食物颜色*/
    eatFoodColor: "#FF6666",
    /*所吃食物颜色*/
    snackMoveDraw: function(t, c, s) {
        if (s == 1) {
            gameCanvas.beginPath();
            switch (snack.keyCode) {
                case 38:
                    gameCanvas.arc(t[0] * 20 + 10, t[1] * 20 + 10, 9, getMyRads(230), getMyRads(-50), true); //向上
                    snack.startAngle = 180;
                    snack.endAngle = 0;
                    break;
                case 37:
                    gameCanvas.arc(t[0] * 20 + 10, t[1] * 20 + 10, 9, getMyRads(140), getMyRads(-140), true); //向左
                    snack.startAngle = 90;
                    snack.endAngle = -90;
                    break;
                case 40:
                    gameCanvas.arc(t[0] * 20 + 10, t[1] * 20 + 10, 9, getMyRads(50), getMyRads(130), true); //向下
                    snack.startAngle = 0;
                    snack.endAngle = 180;
                    break;
                case 39:
                    gameCanvas.arc(t[0] * 20 + 10, t[1] * 20 + 10, 9, getMyRads(-40), getMyRads(40), true); //向右
                    snack.startAngle = -90;
                    snack.endAngle = 90;
                    break;
                default:
                    gameCanvas.arc(t[0] * 20 + 10, t[1] * 20 + 10, 9, getMyRads(snack.startAngle), getMyRads(snack.endAngle), false);
                    break;
            }
            gameCanvas.fillStyle = c;
            gameCanvas.fill();
            gameCanvas.stroke(); //画蛇的头部
        } else {
            gameCanvas.fillStyle = c;
            gameCanvas.fillRect(t[0] * 20 + 1, t[1] * 20 + 1, 18, 18);
        }
    },
    gamebody: function() {
        snack.sn.unshift(snack.headPos = [snack.sn[0][0] + snack.nextMove[0], snack.sn[0][1] + snack.nextMove[1]]); //sn数组头部添加一个元素
        if (snack.foodPos.toString() == snack.headPos.toString()) {
            snack.eatFoodColor = snack.foodColor;
        }
        snack.snackMoveDraw(snack.lastHeadPos, snack.eatFoodColor, 2);
        snack.lastHeadPos = snack.headPos;
        if ((snack.headPos[0] < 0 || snack.headPos[0] > 14) || (snack.headPos[1] < 0 || snack.headPos[1] > 14) || snack.sn.indexOfArray(snack.headPos, 1) >= 0) {
            $("#status").html("没办法，天要收你了！");
            snack.lifeStatus = !snack.lifeStatus;
            snack.snackMoveDraw(snack.sn.pop(), "black", 2);
            return alert("GAME OVER");


        }
        snack.snackMoveDraw(snack.headPos, "#FF9966", 1);
        if (snack.foodPos.toString() == snack.headPos.toString()) {
            while ((snack.sn.indexOfArray(snack.foodPos = [~~(Math.random() * 15), ~~(Math.random() * 15)])) >= 0);
            snack.foodColor = snack.allfoodColor[parseInt(Math.random() * 4)];
            snack.snackMoveDraw(snack.foodPos, snack.foodColor, 2);
            snack.points++;
            $("#points").html("当前吃的数量：" + snack.points);
            switch (true) {
                case snack.points > 0 && snack.points <= 1:
                    $("#status").html("你吃得好慢咯  @/\"！");
                    break;
                case snack.points > 1 && snack.points < 10:
                    $("#status").html("你好棒！(=^ ^=)");
                    break;
                case snack.points > 10:
                    $("#status").html("吃多了小心长胖啊！(o^.^o)");
                    break;
            }
        } else
            snack.snackMoveDraw(snack.sn.pop(), "black", 2); //sn数组去掉最后一个元素
    },
    btDirection: function(w) {
        if (w == 32) {
            snack.runStatus = !snack.runStatus;
        }
        if ((snack.keyCode - w) % 2 != 0 && w != 32 && snack.runStatus) {
            snack.keyCode = w;
            snack.nextMove = snack.moveOps[w - 37] || snack.nextMove; /** 当按键不是37、38、39、40时，方向保存不变 **/
        }
    }
})

Array.prototype.indexOfArray = function() {
    var len = arguments.length;
    if (1 == len) {
        var arr = arguments[0];
        for (var i = this.length - 1; i >= 0; i--) {
            if (this[i].toString() == arr.toString()) {
                return i;
            }
        }
    } else {
        var arr = arguments[0];
        var index = ~~(arguments[1]);
        for (var i = this.length - 1; i >= index; i--) {
            if (this[i].toString() == arr.toString()) {
                return i;
            }
        }
    }
    return -1;
}

function getMyRads(degrees) {
    return (Math.PI * degrees) / 180;
}

document.onkeydown = function(e) {
    if (e.keyCode == 32) {
        snack.runStatus = !snack.runStatus;
    }
    if ((snack.keyCode - e.keyCode) % 2 != 0 && e.keyCode != 32 && snack.runStatus) {
        snack.keyCode = e.keyCode;
        snack.nextMove = snack.moveOps[e.keyCode - 37] || snack.nextMove; /** 当按键不是37、38、39、40时，方向保存不变 **/
    }
}
! function() {
    gameCanvas = $("#cas")[0].getContext("2d");
    if (snack.runStatus) {
        $("#runStatus").html("运行");
        $("#btRun").val(" Stop ");
        snack.gamebody();
    } else {
        $("#runStatus").html("暂停");
        $("#btRun").val(" Run ");
    }
    if (!snack.lifeStatus)
        clearTimeout(snack.timer);
    else
        snack.timer = setTimeout(arguments.callee, 130);
}()
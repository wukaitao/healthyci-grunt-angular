/*! @license
 * Copyright 2015 Bejing Haola Tech
 *
 * you may not use this file except in compliance with the License.
 * Please contact Haola Tech thru hl@ihaola.com.cn for any personal or business usage
 *
 */

//var drawPage = init(window, document, 2);
var selectPage    = 2;
var ss;
var sp;
var surveyContent = {};
var sDesc   = [];
var sScores = [];
var tout;
var iout;
//var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
//var cancelAnimationFrame  = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var canvasBuffer;

function showBtips() {
  $("#box").slideToggle(400);
}

function returnSurvey(e) {
  window.localStorage.setItem(ss+'go', 'gosurvey');
  //window.localStorage.removeItem(ss+'ori');
  window.location.replace(sp);
}

function getReturnUrl(){
  var rurl=window.localStorage.getItem('returnurl');
  //try{cancelAnimationFrame(iout);}
  //catch(ex) {
  //  window.location.replace(decodeURIComponent(rurl));
  //  return;
  //}
  window.location.replace(decodeURIComponent(rurl));
  //window.location.replace("https://www.ihaola.com.cn");
}

function jumptohl() {
  window.location.replace("https://www.ihaola.com.cn/code.html");
}

function resultpage_init(window, document, survey_id, chart_type, description, startpage, other_links, followimg, followcontent, indexstyle, zbstyle, meturl) {
  chartType = chart_type;

  if (!window.localStorage.getItem(survey_id+'ori')) {
    window.location.replace(startpage);
  }
  else {
    //获得结果、试卷和提交数据
    var idegree = 0;
    var pdegree = 0;
    var tdegree = 1;
    var ppercent = [61.8, 85.4, 100];
    var ppoint = [40, 85.4, 100];
    var scalearray=[0.58,0.6,0.7,0.08,0.18];


    var surveyType = survey_id;
    ss             = String(surveyType);
    sp             = startpage;

    var surveyResult = JSON.parse(window.localStorage.getItem(ss+'ori'));

    surveyContent = JSON.parse(window.localStorage.getItem(ss+'surveyContent'));

    if (description==null) description = surveyContent.type;

    //var data_to_send = JSON.parse(window.localStorage.getItem(ss + 'data_to_send'));

    var sName   = [];


    var x       = surveyResult.scores[1] || 8;
    var yy      = surveyResult.scores[0];
    var cfont;


    if (yy > 94) {
      yy = 95;
    }

    if (yy <= 0) {
      yy=2
    }

    var j  = 1;
    var jx = 1;
    var ix;
    if (surveyResult.scores.length > 10) {
      for (i = 1; i < surveyResult.scores.length; i++) {
        if (surveyResult.scores[i] > 0) {
          sScores[jx-1] = surveyResult.scores[i];
          sName[jx-1]   = surveyContent.categories[i].name;
          sDesc[jx-1]=surveyContent.categories[i].description;
          if (x < sScores[jx-1]) {
            x = sScores[jx-1];
            j = jx;
          }
          jx++;
        }
      }
      ix = sScores.length;
      if (ix < 10) {
        for (i = 1; i < surveyResult.scores.length; i++) {
          if (surveyResult.scores[i] <= 0) {
            sScores[ix] = 8;
            sName[ix]   = surveyContent.categories[i].name;
            sDesc[ix]=surveyContent.categories[i].description;
            ix++;
            if (ix==10) {
              break;
            }
          }
        }
      }
    }
    else {
      for (i = 1; i < surveyResult.scores.length; i++) {
        sScores[i-1] = surveyResult.scores[i];
        sName[i-1]   = surveyContent.categories[i].name;
        sDesc[i-1]=surveyContent.categories[i].description;
        if (x < surveyResult.scores[i]) {
          x = surveyResult.scores[i];
          j = i;
        }
        if (sScores[i-1] <= 0) {
          sScores[i-1] = 8;
        }
      }
    }

    //geturl
    function geturl(metid) {
      var furl = "https://www.ihaola.com.cn/code.html";
      for (ir = 0; ir < meturl.length; ir++) {
        if (metid==meturl[ir][0]) {
          furl = meturl[ir][1];
        }
      }
      return furl;
    }

    //by函数接受一个成员名字符串做为参数
    //并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
    var by = function(name) {
      return function(o, p) {
        var a, b;
        if (typeof o==="object" && typeof p==="object" && o && p) {
          a = o[name];
          b = p[name];
          if (a===b) {
            return 0;
          }
          if (typeof a=== typeof b) {
            return a < b ? -1 : 1;
          }
          return typeof a < typeof b ? -1 : 1;
        }
        else {
          throw ("error");
        }
      }
    };

    //find choice option
    var frChoice = function fChoice(frid) {
      var fl    = frid.substr(0, frid.indexOf("."));
      var fr    = frid.substr(frid.indexOf(".")+1);
      var fn    = surveyContent.questions.length;
      var fMark = 0;
      var frurl = "";
      while ((fn--) && (fMark==0)) {
        if (surveyContent.questions[fn].qid==fl) {
          var fReturn   = surveyContent.questions[fn].option_list[fr].description;
          var fChoiceID = surveyContent.questions[fn].option_list[fr].choice_id;

          //var frurl = geturl(fChoiceID);
          if (mt=="7871405f-de94-7406-de55-f18e26cb4345") {
            if (fl=="120") {
              fReturn = "大姨妈期间"+fReturn
            }
            else {
              fReturn = "平时"+fReturn
            }
          }
          fMark = 1;
        }
      }
      //console.log(fReturn,",",frurl);
      var frarr = [fReturn, frurl];
      return frarr;
    };

    var frPercent = function fPercent(qrid) {
      var qn    = surveyResult.match_detail2.length;
      var qMark = 0;
      while ((qn--) && (qMark==0)) {
        if (surveyResult.match_detail2[qn]._id==qrid) {
          var qReturn = surveyResult.match_detail2[qn].count;
          qMark       = 1;
        }
      }
      if (qReturn > 0) {
        return qReturn;
      }
      else {
        return 1;
      }
    };

    var mt   = surveyType;
    var mlen = 0;
    if (surveyResult.match_detail1) mlen=surveyResult.match_detail1.length;

    rMatrix = [];
    for (i = 0; i < mlen; i++) {
      rMatrix[i] = {
        rID      : surveyResult.match_detail1[i]._id,
        rPeople  : surveyResult.match_detail1[i].count,
        rPercent : frPercent(surveyResult.match_detail1[i]._id)*100/surveyResult.match_detail1[i].count
      };
    }

    rMatrix.sort(by("rPeople"));
    var rRemNum = 0;
    for (i = 0; i < rMatrix.length-1; i++) {
      if (rMatrix[i].rPeople < 15) {
        rRemNum++;
      }
    }
    if (rRemNum > 0) {
      rMatrix.splice(0, rRemNum);
    }

    rMatrix.sort(by("rPercent"));


    var dcanvas = document.getElementById("d_canvas");
    var tcanvas = document.getElementById("t_canvas");
    var scanvas = document.getElementById("s_canvas");
    var dxcanvas = document.getElementById("dx_canvas");
    var dycanvas = document.getElementById("dy_canvas");

    //自动调整画布大小

    function resizeCanvasBig() {
      if (window.innerWidth > window.innerHeight) {
        dcanvas.width  = window.innerWidth;
        dcanvas.height = window.innerHeight*scalearray[0];
        tcanvas.width = window.innerWidth;
        tcanvas.height = window.innerHeight*scalearray[1];
        scanvas.width  = window.innerWidth;
        scanvas.height = window.innerHeight*scalearray[2];
        dxcanvas.width  = window.innerWidth;
        dxcanvas.height = window.innerHeight*scalearray[3];
        dycanvas.width  = window.innerWidth;
        dycanvas.height = window.innerHeight*scalearray[4];
      }
      else {
        dcanvas.width  = window.innerWidth;
        dcanvas.height = window.innerHeight*scalearray[0];
        tcanvas.width = window.innerWidth;
        tcanvas.height = window.innerHeight*scalearray[1];
        scanvas.width  = window.innerWidth;
        scanvas.height = window.innerHeight*scalearray[2];
        dxcanvas.width  = window.innerWidth;
        dxcanvas.height = window.innerHeight*scalearray[3];
        dycanvas.width  = window.innerWidth;
        dycanvas.height = window.innerHeight*scalearray[4];
      }
    }

    switch (chartType) {
      default:
      {
        resizeCanvasBig();

        var dctx1 = document.getElementById("d_canvas").getContext("2d");
        var dctx2 = document.getElementById("t_canvas").getContext("2d");
        var dctx3 = document.getElementById("s_canvas").getContext("2d");
        var dctx4 = document.getElementById("dx_canvas").getContext("2d");
        var dctx5 = document.getElementById("dy_canvas").getContext("2d");
        var w1  = dctx1.canvas.width;
        var h1 = dctx1.canvas.height;
        var w2  = dctx2.canvas.width;
        var h2 = dctx2.canvas.height;
        var w3  = dctx3.canvas.width;
        var h3 = dctx3.canvas.height;
        var w4  = dctx4.canvas.width;
        var h4 = dctx4.canvas.height;
        var w5  = dctx5.canvas.width;
        var h5 = dctx5.canvas.height;

        //High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
        if (window.devicePixelRatio) {
          dctx1.canvas.style.width = w1 + "px";
          dctx1.canvas.style.height = h1 + "px";
          dctx1.canvas.height = h1 * window.devicePixelRatio;
          dctx1.canvas.width = w1 * window.devicePixelRatio;
          dctx2.canvas.style.width = w2 + "px";
          dctx2.canvas.style.height = h2 + "px";
          dctx2.canvas.height = h2 * window.devicePixelRatio;
          dctx2.canvas.width = w2 * window.devicePixelRatio;
          dctx3.canvas.style.width  = w3+"px";
          dctx3.canvas.style.height = h3+"px";
          dctx3.canvas.height       = h3*window.devicePixelRatio;
          dctx3.canvas.width        = w3*window.devicePixelRatio;
          dctx4.canvas.style.width  = w4+"px";
          dctx4.canvas.style.height = h4+"px";
          dctx4.canvas.height       = h4*window.devicePixelRatio;
          dctx4.canvas.width        = w4*window.devicePixelRatio;
          dctx5.canvas.style.width  = w5+"px";
          dctx5.canvas.style.height = h5+"px";
          dctx5.canvas.height       = h5*window.devicePixelRatio;
          dctx5.canvas.width        = w5*window.devicePixelRatio;
        }
      }
    }
  }

  return function drawPage(xchartType) {

    var setupRAF = function () {
      var lastTime = 0;
      var vendors  = ['ms', 'moz', 'webkit', 'o'];
      for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame  = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
      }
      ;

      if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = function (callback, element) {
          var currTime   = new Date().getTime();
          var timeToCall = Math.max(0, 16-(currTime-lastTime));
          vid         = window.setTimeout(function () {
            callback(currTime+timeToCall);
          }, timeToCall);
          lastTime       = currTime+timeToCall;
          return vid;
        };
      }

      if ( !window.cancelAnimationFrame ) {
        window.cancelAnimationFrame = function (vid) {
          clearTimeout(vid);
        };
      }
    };

    setupRAF()

    selectPage = xchartType;
    if (tout) {
      window.clearTimeout(tout);
    }

    if (iout) {
      window.cancelAnimationFrame(iout);
    }

    //绘制动态图
    {

      //canvasBuffer = document.createElement("canvas");
      //canvasBuffer.width = dcanvas.width;
      //canvasBuffer.height = dcanvas.height;
      //contextBuffer = canvasBuffer.getContext("2d");
      //contextBuffer.canvas.style.width=dctx1.canvas.style.width ;
      //contextBuffer.canvas.style.height=dctx1.canvas.style.height;
      //contextBuffer.canvas.height=dctx1.canvas.height;
      //contextBuffer.canvas.width=dctx1.canvas.width;
      //contextBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);

      function drawNtitle(xn,yn,wn,hn,dctx,imgname,txt,fontsize){
        var imageObj = new Image();
        imageObj.onload = function() {
          dctx.drawImage(imageObj, xn, yn, wn, hn);
          dctx.beginPath();
          dctx.fillStyle = '#383838';
          dctx.font = 'bold ' + Math.ceil(fontsize) + 'px 微软雅黑';
          dctx.textAlign = 'left';
          dctx.textBaseline = 'top';
          dctx.fillText(
              txt,
              xn+2*wn,
              yn
          );
        };
        imageObj.src    = 'https://www.ihaola.com.cn/images/'+String(imgname)+'.png';
      }

      function drawImg(xn,yn,wn,hn,dctx,imgname){
        var imageObj = new Image();
        imageObj.onload = function() {
          dctx.drawImage(imageObj, xn, yn, wn, hn);
        };
        imageObj.src    = 'https://www.ihaola.com.cn/images/'+String(imgname)+'.png';
      }

      var swidth=dcanvas.width;
      var sheight=dcanvas.height;
      var stitle=dcanvas.width*0.5*0.1;

      dctx4.clearRect(0, 0, dxcanvas.width, dxcanvas.height);
      drawNtitle(0.05*swidth,0.05*sheight,0.06*swidth,0.06*swidth,dctx4,"i1","鼻炎评估报告",stitle);


      //drawImg(0.05*swidth,0.9*sheight*scalearray[0]+dRadius*0.18-swidth*1.526/7,swidth/7,swidth*1.526/7,dctx1,"doc1");

     //蛛网图
      {
          pdegree = 0;
          var edgeNumber = sScores.length;
          var newWidth = dcanvas.width;
          var newHeight = dcanvas.height;
          var xnewHeight=dycanvas.height;
          var diff1 = 0.05 * dcanvas.height;
          var dRadius = Math.min(newHeight / 2, newWidth / 2) * 1.5 / 3;
          var pscale;

          var bcolor = [
            "#8ce9d2",
            "#6fdbff",
            "#6ecfff",
            "rgba(250,250,250,0.8)"
          ];

          var pcolor = [
            "rgba(0,225,0,1)",
            "rgba(255,255,0,1)",
            "#ee734d",
            "rgba(250,250,250,1)"
          ];

          pscale = 0.9;

        {
          //底部矩形线框
          dctx5.clearRect(0, 0, dycanvas.width, dycanvas.height);
          dctx5.font = 'bold ' +Math.ceil(dRadius * 0.14) + 'px 微软雅黑';
          var vType1 = "您的" + description + "类型偏向于" + sName[j - 1];
          var wvT1 = dctx5.measureText(vType1).width / 2;

          dctx5.beginPath();
          dctx5.lineCap="round";

          dctx5.moveTo(0.05*newWidth+newWidth/7-dRadius*0.1,xnewHeight * 0.55);
          dctx5.lineTo(0.05*newWidth+newWidth/7+2*wvT1+dRadius*0.1,xnewHeight * 0.55);
          dctx5.strokeStyle="#4ebfe6";
          dctx5.lineWidth=dRadius*0.50;
          dctx5.stroke();

          //报告底部说明
          dctx5.beginPath();
          dctx5.fillStyle = '#ffffff';
          dctx5.font = 'bold ' +Math.ceil(dRadius * 0.14) + 'px 微软雅黑';
          dctx5.textAlign = 'left';

          dctx5.fillText(
              vType1,
              0.05*newWidth+newWidth/7+dRadius*0.05,
              xnewHeight * 0.55);

          drawImg(0.05*newWidth,0.55*xnewHeight+dRadius*0.25-newWidth*1.526/7,newWidth/7,newWidth*1.526/7,dctx5,"doc1");
        }


          function drawReminder(xp, yp, sp, cp, rp,dctx) {
            dctx.beginPath();
            dctx.fillStyle = cp;
            dctx.fillRect(xp, yp, sp, sp);
            dctx.closePath();

            dctx.beginPath();
            dctx.fillStyle = "#000000";
            dctx.font = Math.ceil(sp) + 'px 微软雅黑';
            dctx.textAlign = 'left';
            dctx.textBaseline = 'top';
            dctx.fillText(rp, xp + 0.12 * dRadius, yp);
          }

          function getComp(Comp) {
            if (Comp <= ppoint[0]) { //( risk_level == 'low' ) {
              return ppercent[0] / ppoint[0];
            }
            else if ((Comp > ppoint[0]) && (Comp <= ppoint[1])) {//( risk_level == 'mid' ) {
              return (ppercent[0] + (Comp - ppoint[0]) * ((ppercent[1] - ppercent[0]) / (ppoint[1] - ppoint[0]))) / Comp;
            }
            else if ((Comp > ppoint[1]) && (Comp <= 100)) {
              return (ppercent[1] + (Comp - ppoint[1]) * ((ppercent[2] - ppercent[1]) / (ppoint[2] - ppoint[1]))) / Comp;
            }
            else {
              return 1
            }
          }

          function drawPolygon(dctx) {
            var fontDiff;
            //三圈基本多边形
            dctx.clearRect(0, 0, dcanvas.width, dcanvas.height);
            for (jj = 3; jj > 0; jj--) {
              dctx.beginPath();
              dctx.moveTo(
                  newWidth / 2,//+Math.sin(0)*dRadius*ppercent[jj-1],
                  newHeight / 2 + diff1 - pscale*dRadius * ppercent[jj - 1] / 100//Math.cos(0)*dRadius*ppercent[jj-1]
              );
              for (i = 1; i < edgeNumber; i++) {
                dctx.lineTo(
                    newWidth / 2 + Math.sin(i * 360 / edgeNumber * Math.PI / 180) * pscale*dRadius * ppercent[jj - 1] / 100,
                    newHeight / 2 + diff1 - Math.cos(i * 360 / edgeNumber * Math.PI / 180) * pscale*dRadius * ppercent[jj - 1] / 100
                );
              }
              dctx.closePath();
              dctx.fillStyle = bcolor[jj - 1];
              dctx.fill();
              //dctx.lineWidth = 1;
              //dctx.strokeStyle = dcolor[jj - 1];
              //dctx.stroke();
            }

            for (i = 0; i < edgeNumber; i++) {
              //基本辐射线
              dctx.beginPath();
              dctx.moveTo(newWidth / 2, newHeight / 2 + diff1);
              dctx.lineTo(
                  newWidth / 2 + Math.sin(i * 360 / edgeNumber * Math.PI / 180) * dRadius*pscale,
                  newHeight / 2 + diff1 - Math.cos(i * 360 / edgeNumber * Math.PI / 180) * dRadius*pscale
              );
              dctx.lineWidth = 1;
              dctx.strokeStyle = "#ffffff";
              dctx.stroke();
            }


            //绘制得分
            dctx.beginPath();
            dctx.moveTo(
                newWidth / 2 + Math.sin(0) * getComp(sScores[0]) * dRadius * pdegree * pscale * (sScores[0] / x) / 100,
                newHeight / 2 + diff1 - Math.cos(0) * getComp(sScores[0]) * dRadius * pdegree * pscale * (sScores[0] / x) / 100
            );
            for (i = 1; i < edgeNumber; i++) {
              dctx.lineTo(
                  newWidth / 2 + Math.sin(i * 360 / edgeNumber * Math.PI / 180) * getComp(sScores[i]) * dRadius * pdegree * pscale * (sScores[i] / x) / 100,
                  newHeight / 2 + diff1 - Math.cos(i * 360 / edgeNumber * Math.PI / 180) * getComp(sScores[i]) * dRadius * pdegree * pscale * (sScores[i] / x) / 100
              )
            }
            dctx.closePath();
            //dctx.fillStyle = "rgba(254,147,0,0.5)";
            dctx.fillStyle = "rgba(255,246,1,0.7)";
            dctx.fill();
            dctx.lineWidth = 3;
            dctx.strokeStyle = "rgba(255,255,255,1)";
            dctx.stroke();

            //绘制得分点
            for (i = 0; i < edgeNumber; i++) {
              dctx.beginPath();
              //等速同时到达
              dctx.arc(
                  newWidth / 2 + Math.sin(i * 360 / edgeNumber * Math.PI / 180) * getComp(sScores[i]) * dRadius * pdegree * pscale * (sScores[i] / x) / 100,
                  newHeight / 2 + diff1 - Math.cos(i * 360 / edgeNumber * Math.PI / 180) * getComp(sScores[i]) * dRadius * pdegree * pscale * (sScores[i] / x) / 100,
                  dRadius * 0.04, 0, 2 * Math.PI, false);

              if (sScores[i] <= ppoint[0]) { //( risk_level == 'low' ) {
                dctx.fillStyle = pcolor[0];
              }
              else if ((sScores[i] > ppoint[0]) && (sScores[i] <= ppoint[1])) {//( risk_level == 'mid' ) {
                dctx.fillStyle = pcolor[1];
              }
              else if ((sScores[i] > ppoint[1]) && (sScores[i] <= ppoint[2])) {
                dctx.fillStyle = pcolor[2];
              }
              //else if (sScores[i] > 100) {
              //  dctx.fillStyle = pcolor[2];
              //}
              else {
                dctx.fillStyle = pcolor[2];
              }
              dctx.fill();
              dctx.lineWidth = 3;
              dctx.strokeStyle = "rgba(255,255,255,1)";
              dctx.stroke();
            }

            //文字部分
            for (i = 0; i < edgeNumber; i++) {
              if ((i * 360 / edgeNumber) > 89 && (i * 360 / edgeNumber) < 271) {
                fontDiff = 0.2 * dRadius;
                //console.log(fontDiff)
              }
              else {
                fontDiff = -0.2 * dRadius;
              }
              if ((pdegree > x - 1) && (i == j - 1) && (x > ppoint[0])) {
                dctx.fillStyle = 'rgb(255,0,0)';
              }
              else {
                dctx.fillStyle = '#5c5c5c';
              }
              dctx.font = Math.ceil(dRadius * 0.09) + 'px 微软雅黑';
              dctx.textAlign = 'center';
              dctx.textBaseline = 'middle';
              dctx.fillText(
                  sName[i],
                  newWidth / 2 + Math.sin(i * 360 / edgeNumber * Math.PI / 180) * dRadius*pscale,
                  newHeight / 2 + diff1 - Math.cos(i * 360 / edgeNumber * Math.PI / 180) * dRadius*pscale + fontDiff
              );
            }

            drawReminder(0.86 * newWidth, 0.03 * newHeight, 0.08 * dRadius, bcolor[2], "高",dctx1);
            drawReminder(0.86 * newWidth, 0.06 * newHeight, 0.08 * dRadius, bcolor[1], "中",dctx1);
            drawReminder(0.86 * newWidth, 0.09 * newHeight, 0.08 * dRadius, bcolor[0], "低",dctx1);

            //dctx1.clearRect(0, 0, dcanvas.width, dcanvas.height);
            //dctx1.drawImage(canvasBuffer, 0, 0);

            pdegree = pdegree + 1;
          }

          //绘制症状分布动画
          function drawRadar() {
            if (pdegree < x + 1) {
              drawPolygon(dctx1);
              iout = window.requestAnimationFrame(drawRadar);
            }
          }
          window.requestAnimationFrame(drawRadar);

        }
      //有效性
      {

        vPercent = [12, 23, 35, 57, 68];
        vPsum    = 60;
        vColor   = ["rgb(242,160,174)", "rgb(228,212,189)", "rgb(90,104,153)", "rgb(105,185,223)", "#f47d5b"];

        //tdegree       = 1;
        tdegree=vPsum;
        var newWidth2  = tcanvas.width;
        var newHeight2 = tcanvas.height;

        function drawRow(rx, ry, rw, rh, tx, ty, tz, rcolor, ti) {
          var linew;
          //dctx2.clearRect(rx, ry, rw, rh);
          var vx  = parseInt(tx.length/13);

          //应对方法
          dctx2.beginPath();
          dctx2.fillStyle    = '#333333';
          dctx2.font         = Math.ceil(rh*0.25)+'px 微软雅黑';
          dctx2.textAlign    = 'left';
          dctx2.textBaseline = 'middle';

          for (ivx = 0; ivx < vx+1; ivx++) {
            dctx2.fillText(tx.substr(ivx*13, 13), rx+rw*0.1, ry+rh/2-rh/8*vx+rh/4*ivx);
          }

          //有效性
          //外圆1
          dctx2.beginPath();
          dctx2.arc(rx+rw*0.92, ry+rh/2, 0.48*rh/2, 0, 2*Math.PI, false);
          dctx2.closePath();
          dctx2.fillStyle = "#cccccc";
          dctx2.fill();

          //外圆2
          dctx2.beginPath();
          dctx2.arc(rx+rw*0.92, ry+rh/2, 0.46*rh/2, 0, 2*Math.PI, false);
          dctx2.closePath();
          dctx2.fillStyle = "#ffffff";
          dctx2.fill();

          //扇形
          dctx2.beginPath();
          dctx2.moveTo(rx+rw*0.92, ry+rh/2);
          dctx2.lineTo(rx+rw*0.92, ry+0.2*rh/2);
          dctx2.arc(rx+rw*0.92, ry+rh/2, 0.46*rh/2, 1.5*Math.PI, (ty*0.02-0.5)*Math.PI, false);
          dctx2.lineTo(rx+rw*0.92, ry+rh/2);
          dctx2.closePath();
          dctx2.fillStyle = rcolor;
          dctx2.fill();

          //100%时特殊处理
          if (ty==100) {
            dctx2.beginPath();
            dctx2.arc(rx+rw*0.92, ry+rh/2, 0.43*rh/2, 0, 2*Math.PI, false);
            dctx2.closePath();
            dctx2.fillStyle = vColor[0];
            dctx2.fill();
          }

          //内圆文字
          dctx2.beginPath();
          dctx2.fillStyle    = '#333333';
          dctx2.font         = Math.ceil(rh*0.2)+'px 微软雅黑';
          dctx2.textAlign    = 'center';
          dctx2.textBaseline = 'middle';
          dctx2.fillText(String(ty)+"%", rx+rw*0.92, ry+rh/2);
          //dctx2.strokeStyle = '#999999';
        }

        function drawFooter(rx, ry, rw, rh) {
          //remarks
          dctx2.fillStyle = '#888888';
          dctx2.font      = Math.ceil(rh*0.1)+'px 微软雅黑';
          dctx2.textAlign = 'left';
          dctx2.fillText("与您症状相同的"+String(typeSum())+"位用户，有效性排名前五的方法！", rx+rw*0.05, 0.9*newHeight2);
          //dctx2.fillText("有效性排名前五的方法", rx+rw*0.1, 0.94*newHeight2);
        }

        function drawTable() {
          //drawTitle(0.05*newWidth2, 0, 0.9*newWidth2, 0.1*newHeight2);
          var rml = Math.max(0, rMatrix.length-5);
          for (i = 0; i < Math.min(5, rMatrix.length); i++) {
            var frResult = frChoice(rMatrix[rml+i].rID);
            drawRow(0.05*newWidth2, 0.12*(5-i)*newHeight2+0.1*newHeight2, 0.9*newWidth2, 0.12*newHeight2,
                frResult[0], (tdegree*rMatrix[rml+i].rPercent/vPsum).toFixed(0), rMatrix[rml+i].rPeople, vColor[4], 5-i);
          }

          //drawLadyBird(0.05 * newWidth2, 0.02 * newHeight2, 0.08 * newHeight2, 1);
          drawFooter(0.05*newWidth2, 0.76*newHeight2, newWidth2, 0.3*newHeight2);
          //tdegree = tdegree+1;
        }

        function typeSum() {
          var maxpeople = 21;
          for (i = 0; i < rMatrix.length-1; i++) {
            if (rMatrix[i].rPeople > maxpeople) {
              maxpeople = rMatrix[i].rPeople;
            }
          }
          return maxpeople
        }

        //绘制动画
        //function drawPercent() {
        //  if (tdegree < vPsum) {
        //    drawTable();
        //    iout = requestAnimationFrame(drawPercent);
        //  }
        //}
        //
        //requestAnimationFrame(drawPercent);
        dctx2.clearRect(0, 0, tcanvas.width, tcanvas.height);
        drawTable();
        drawNtitle(0.05*swidth,0.05*sheight,0.06*swidth,0.06*swidth,dctx2,"i2","应对方法及有效性",stitle);

      }
      //表盘指数
      {
        //var indextitle   = "您的"+description+"评分";
          //idegree = 0;
        idegree=yy * 1.2 + 1;
          window.localStorage.setItem(ss + 'badge3', '0');
          var newWidth3 = scanvas.width;
          var newHeight3 = 0.8 * scanvas.height;//change 0.6 to 0.8
          var diff2 = 0.15 * scanvas.height;
          var dRadius = Math.min(newHeight3 / 2, newWidth3 / 2) * 0.65;
          var eRadius = dRadius * 1.1;
          var innerRadius = dRadius * 0.9;
          var outerRadius = dRadius * 1;
          var dcolor = [
            "#FF5809",
            "#F75000",
            "#FF8F59",
            "#FF9D6F",
            "#FFBD9D",
            "#FFD306",
            "#FFFF37",
            "#FFFFAA",
            "#FFFFAA",
            "#FFFFDF",
            "#02F78E",
            "#7AFEC6",
            "#D7FFEE"
          ];
          var sDegree = ["轻微", "严重", "异常", "正常"];

          function drawdegree() {
            dctx3.clearRect(0, 0, scanvas.width, scanvas.height);
            //完整路径
            dctx3.beginPath();
            dctx3.arc(newWidth3 / 2, newHeight3 / 2 + diff2, innerRadius, Math.PI / 6, Math.PI * 5 / 6, true);
            //连接弧的半径终点为内弧半径加上外弧半径再除以2，两半径差值除以2为圆心
            dctx3.arc(
                newWidth3 / 2 + Math.sin(240 * Math.PI / 180) * ((innerRadius + outerRadius) / 2),
                newHeight3 / 2 + diff2 - Math.cos(240 * Math.PI / 180) * ((innerRadius + outerRadius) / 2),
                (outerRadius - innerRadius) / 2, Math.PI * 11 / 6, Math.PI * 5 / 6, false
            );
            dctx3.arc(newWidth3 / 2, newHeight3 / 2 + diff2, outerRadius, 5 * Math.PI / 6, Math.PI / 6, false);
            dctx3.arc(
                newWidth3 / 2 + Math.sin(120 * Math.PI / 180) * ((innerRadius + outerRadius) / 2),
                newHeight3 / 2 + diff2 - Math.cos(120 * Math.PI / 180) * ((innerRadius + outerRadius) / 2),
                (outerRadius - innerRadius) / 2, Math.PI * 1 / 6, Math.PI * 7 / 6, false
            );

            dctx3.closePath();
            dctx3.fillStyle = "#33b8e1";
            dctx3.fill();
            dctx3.strokeStyle = '#33b8e1';
            dctx3.lineWidth = 1;
            dctx3.stroke();

            //绘制刻度
            dctx3.shadowOffsetX = 0;
            dctx3.shadowOffsetY = 0;
            dctx3.shadowBlur = 0;
            var xcolor;
            var lineH = 0.05;
            var xDegree, yDegree, facestyle;
            for (i = 0; i < 18; i++) {
              if (i > 6 && i < 12) {
              }
              else {
                if (i < 7) {
                  xcolor = dcolor[i + 6];
                  xDegree = i * 10 + 60;
                }
                else {
                  xcolor = dcolor[i - 12];
                  xDegree = i * 10 - 120;
                }
                dctx3.beginPath();
                dctx3.arc(
                    newWidth3 / 2 + Math.sin(i * 20 * Math.PI / 180) * (innerRadius + outerRadius) / 2,
                    newHeight3 / 2 + diff2 - Math.cos(i * 20 * Math.PI / 180) * (innerRadius + outerRadius) / 2,
                    (outerRadius - innerRadius) / 4, 0, 2 * Math.PI
                );
                dctx3.strokeStyle = 'rgba(0,0,255,0.25)';
                dctx3.lineWidth = 1;
                dctx3.stroke();
                dctx3.fillStyle = xcolor;
                dctx3.fill();
                if (i % 3 == 0) {
                  dctx3.beginPath();
                  dctx3.moveTo(
                      newWidth3 / 2 + Math.sin(i * 20 * Math.PI / 180) * innerRadius * 0.9,
                      newHeight3 / 2 + diff2 - Math.cos(i * 20 * Math.PI / 180) * innerRadius * 0.9
                  );
                  dctx3.lineTo(
                      newWidth3 / 2 + Math.sin(i * 20 * Math.PI / 180) * innerRadius * (0.8 + lineH),
                      newHeight3 / 2 + diff2 - Math.cos(i * 20 * Math.PI / 180) * innerRadius * (0.8 + lineH)
                  );
                  dctx3.strokeStyle = "#000000";
                  dctx3.lineWidth = 1;
                  dctx3.stroke();

                  dctx3.beginPath();
                  dctx3.fillStyle = '#33b8e1';
                  dctx3.font = Math.ceil(dRadius * 0.1) + 'px 微软雅黑';
                  dctx3.textAlign = 'center';
                  dctx3.textBaseline = 'middle';
                  if (xDegree == 0) {
                    if (indexstyle == 1) {
                      yDegree = sDegree[2];
                      facestyle = 2;
                    }
                    else {
                      yDegree = sDegree[0];
                      facestyle = 1
                    }
                  }

                  if (xDegree == 120) {
                    if (indexstyle == 1) {
                      yDegree = sDegree[3];
                      facestyle = 1;
                    }
                    else {
                      yDegree = sDegree[1];
                      facestyle = 2;
                    }
                  }

                  if ((xDegree == 0) || (xDegree == 120)) {

                    drawface(
                        newWidth3 / 2 + Math.sin(i * 20 * Math.PI / 180) * outerRadius * (1.1 + lineH),
                        newHeight3 / 2 + diff2 - Math.cos(i * 20 * Math.PI / 180) * outerRadius * (1.1 + lineH) + dRadius * 0.15,
                        (innerRadius + outerRadius) / 25,
                        facestyle
                    );
                  }
                  dctx3.fillStyle = '#33b8e1';
                  dctx3.fillText(
                      xDegree / 1.2,
                      newWidth3 / 2 + Math.sin(i * 20 * Math.PI / 180) * outerRadius * (1.1 + lineH),
                      newHeight3 / 2 + diff2 - Math.cos(i * 20 * Math.PI / 180) * outerRadius * (1.1 + lineH));
                }
              }
            }

            //指针
            var k, l, m, n;
            k = 240 + idegree * 2;
            l = 330 + idegree * 2;
            m = 60 + idegree * 2;
            n = 150 + idegree * 2;
            dctx3.shadowOffsetX = 1;
            dctx3.shadowOffsetY = 1;
            dctx3.shadowBlur = 2;
            dctx3.shadowColor = "rgba(70,80,90,0.8)";
            dctx3.beginPath();
            dctx3.moveTo(
                newWidth3 / 2 + Math.sin(k * Math.PI / 180) * innerRadius,
                newHeight3 / 2 + diff2 - Math.cos(k * Math.PI / 180) * innerRadius
            );
            dctx3.lineTo(
                newWidth3 / 2 + Math.sin(l * Math.PI / 180) * (dRadius * 0.1),
                newHeight3 / 2 + diff2 - Math.cos(l * Math.PI / 180) * (dRadius * 0.1)
            );
            dctx3.lineTo(
                newWidth3 / 2 + Math.sin(m * Math.PI / 180) * (dRadius * 0.2),
                newHeight3 / 2 + diff2 - Math.cos(m * Math.PI / 180) * (dRadius * 0.2)
            );
            dctx3.lineTo(
                newWidth3 / 2 + Math.sin(n * Math.PI / 180) * (dRadius * 0.1),
                newHeight3 / 2 + diff2 - Math.cos(n * Math.PI / 180) * (dRadius * 0.1)
            );
            dctx3.closePath();
            dctx3.fillStyle = "#33b8e1";
            dctx3.fill();

            //内圆外
            dctx3.shadowOffsetX = 1;
            dctx3.shadowOffsetY = 1;
            dctx3.shadowBlur = 4;
            dctx3.shadowColor = "rgba(70,80,90,0.8)";
            dctx3.beginPath();
            dctx3.arc(newWidth3 / 2, newHeight3 / 2 + diff2, dRadius * 0.1, 0, 2 * Math.PI);
            dctx3.lineWidth = 1;
            dctx3.strokeStyle = "rgba(70,80,90,1)";
            dctx3.stroke();
            dctx3.fillStyle = "rgba(197,245,255,1)";
            dctx3.fill();

            //内圆内
            dctx3.shadowOffsetX = 0;
            dctx3.shadowOffsetY = 0;
            dctx3.shadowBlur = 0;
            dctx3.beginPath();
            dctx3.arc(newWidth3 / 2, newHeight3 / 2 + diff2, 2, 0, 2 * Math.PI);
            dctx3.closePath();
            dctx3.fillStyle = "#5c5c5c";
            dctx3.fill();

            ////表盘下文字
            dctx3.shadowBlur = 0;
            dctx3.fillStyle = '#33b8e1';
            dctx3.font = Math.ceil(dRadius * 0.45) + 'px 微软雅黑';
            dctx3.textAlign = 'center';
            dctx3.textBaseline = 'middle';
            dctx3.fillText(Math.round(idegree / 1.2), newWidth3 / 2, Math.ceil(newHeight3 / 2 + diff2 + dRadius*0.8));

            //表盘上文字
            //dctx3.fillStyle = '#666666';
            //dctx3.font = 'bold ' + Math.ceil(dRadius * 0.14) + 'px 微软雅黑';
            //dctx3.textAlign = 'center';
            //dctx3.textBaseline = 'middle';
            //dctx3.fillText(indextitle, newWidth3 / 2, Math.ceil(diff2 + dRadius * 0.1));

            ////总共病友
            //dctx3.beginPath();
            //dctx3.fillStyle = "rgb(30, 155, 234)";
            //dctx3.arc(newWidth3 / 2 - dRadius * 0.4, scanvas.height * 0.9, dRadius * 0.11, 0, 2 * Math.PI);
            //dctx3.fill();
            ////病友数
            //dctx3.beginPath();
            //dctx3.fillStyle = '#ffffff';
            //dctx3.font = 'bold ' + Math.ceil(dRadius * 0.12) + 'px 微软雅黑';
            //dctx3.textAlign = 'center';
            //dctx3.textBaseline = 'middle';
            //dctx3.fillText(
            //    "亲",
            //    //surveyResult.ranking.total,
            //    newWidth3 / 2 - dRadius * 0.4,
            //    scanvas.height * 0.9
            //);

            //病友
            dctx3.fillStyle = '#c8c8c8';
            dctx3.font = Math.ceil(dRadius * 0.12) + 'px 微软雅黑';
            dctx3.textAlign = 'center';
            var mTip;

            if (indexstyle == 1) {
              mTip = "指数越高越好";
            }
            else {
              mTip = "指数越低越好";
            }
            dctx3.fillText(
                mTip,
                //"位" + description + "病友@好啦科技",
                newWidth3 / 2,
                scanvas.height * 0.9); //change from 0.8 to 0.9

            //idegree = idegree + 1;
          }

          function drawface(x, y, r, facestyle) {
            //face
            dctx3.beginPath();
            dctx3.arc(
                x, y, r, 0, 2 * Math.PI
            );
            dctx3.fillStyle = "rgba(255,221,0,1)";
            dctx3.fill();
            dctx3.lineWidth = 1;
            dctx3.strokeStyle = "#cccccc";
            dctx3.stroke();
            //eyes
            dctx3.beginPath();
            dctx3.fillStyle = "#333333";
            dctx3.arc(
                x + Math.sin(45 * Math.PI / 180) * r / 2,
                y - Math.cos(45 * Math.PI / 180) * r / 2,
                r / 10, 0, 2 * Math.PI
            );
            dctx3.fill();
            dctx3.beginPath();
            dctx3.arc(
                x + Math.sin(315 * Math.PI / 180) * r / 2,
                y - Math.cos(315 * Math.PI / 180) * r / 2,
                r / 10, 0, 2 * Math.PI
            );
            dctx3.fill();

            //mouth
            dctx3.beginPath();
            dctx3.strokeStyle = "#333333";
            //dctx3.fillStyle="#000000";
            dctx3.lineWidth = r / 10;
            if (facestyle == 1) {
              dctx3.arc(
                  x, y, r / 2, 45 * Math.PI / 180, 135 * Math.PI / 180
              )
            }
            else {
              dctx3.arc(
                  x, y + r, 2 * r / 3, 225 * Math.PI / 180, 315 * Math.PI / 180)
            }
            dctx3.stroke();
          }


        drawdegree();
        drawNtitle(0.05*swidth,0.05*sheight,0.07*swidth,0.06*swidth,dctx3,"i3","鼻炎指数",stitle);

          //绘制动画
          //function drawclock() {
          //  if (idegree < yy * 1.2 + 1) {
          //    drawdegree();
          //    iout = requestAnimationFrame(drawclock);
          //    //tout = setTimeout(drawclock, 1000 / 300);
          //  }
          //
          //}
          //
          //requestAnimationFrame(drawclock);
          ////setTimeout(drawclock, 1000 / 300);

        }



    }
  }
}

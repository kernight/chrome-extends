/*用来注入页面的js文件*/
//运行开关
var running = true;
CreatePanel();
//读取本地存储
//如果之前隐藏了面板，则这次也不显示
console.log(localStorage['imagefinderpanel']);
if("hidden" != localStorage['imagefinderpanel']){
  ShowPanel();
}
console.log("图啥----------加载成功");
ShowMessage("加载成功");
//当开关点击，面板消失,功能暂停
$("#imagefinderpanel_right_title").click(function () {
  if(100  >= $("#imagefinderpanel_right").height()){
    ShowPanel();
  }else{
    HidePanel();
  }
});
//当元素被右击，则进行捕捉
$("*").mousedown(function(e){
  if(running){
    if(3 == e.which){
      var from_index = 1;
      var imgsrc = $(this).attr("src");
      if(undefined == imgsrc){
        from_index = 2;
        imgsrc = GetUrlFromStyle($(this).attr("style"));
      }
      if(undefined == imgsrc){
        from_index = 3;
        imgsrc = GetUrlFromStyle($(this).css("background"));
      }
      if(undefined == imgsrc){
        from_index = 4;
        imgsrc = GetUrlFromStyle($(this).css("background-image"));
      }

      //大小写不敏感的寻找是否有图片格式的文件存在
      var reg = new RegExp(".+(jpg|png|jpeg|bmp|gif)+","i");
      if(1== from_index || reg.test(imgsrc)){
        if(1 == from_index){
          console.log("图啥----------从 img src 属性中获取");
        }else if(2 == from_index){
          console.log("图啥----------从 DOM style 属性中获取");
        }else if(3 == from_index){
          console.log("图啥----------从 css background 属性中获取");
        }else if(4 == from_index){
          console.log("图啥----------从  css background-image 属性中获取");
        }

        //去除url前缀
        imgsrc = RemoveOther(imgsrc);
        console.log("图啥----------找到的图片地址："+imgsrc);
        var name_pos = imgsrc.lastIndexOf('/');
        ShowDetail(imgsrc.substr(name_pos+1),imgsrc);
        return false;
      }
      console.log("图啥----------未找到图片");
      ShowMessage("未找到图片");
      return true;
    }
  }

});


/**
 *从样式表中剥离出背景图的链接
 * @param str 欲匹配的字符串
 * @returns {*}匹配到返回字符串，否则返回indefined
 */
function GetUrlFromStyle(str){
  if(undefined != str){
    //将css属性按照空格进行分割
    var str_arr = str.split(" ");
    //匹配url
    var reg = new RegExp("url(.+)","i");
    for(var i = 0; i < str_arr.length; i++){
      //循环匹配
      //匹配中就返回对应的字符串
      if(reg.test(str_arr[i])){
        return str_arr[i];
      }
    }
  }

  return undefined;
}

var loop_flag = 1;
/**
 *去除除了地址之外的其他字符
 * @param str 欲修正的字符串
 * @returns {*}修正后的字符串
 */
function RemoveOther(str){
  //去除url(:("/')
  str = str.replace(/.*url\((\"|\')*/,"");
  //去除("/'))
  str = str.replace(/(\"|\')*\).*/,"");

  //在前面加入 http[s]://域名/
  var num_loop = 1;
  do{
    var sear = ".*:*\/\/";
    var domain = "";
    //循环递增节点，每个目录为一层
    sear += ".*\/";
    if(str.search(sear)){
      domain = window.location.href;
      domain = domain.match(sear,"")[0];
    }
    //最多循环十次
  }while(false == JudgeSuccess(domain+str) && (num_loop++ < 10));
  return domain+str;
}

/**
 *验证图片地址是否正确
 * @param address 图片地址
 * @returns {*}修正后的字符串
 */
function JudgeSuccess(address){
  var res = false;
  $.ajax({
    url: address,
    datatype: "images",
    type: 'get',
    async:false,
    //成功
    success:function (e) {
      res = true;
    },
    error: function(e){    //失败
      res = false;
    }
  });
  return res;
}

/***
 * 建立查看面板
 * @constructor
 */
function CreatePanel(){
  var div='\
  <style>\
    #imagefinderpanel_right *{\
      margin:0;\
      padding:0;\
    }\
    #imagefinderpanel_right span{\
      display: inline-block;\
    }\
    #imagefinderpanel_right{\
      position:fixed;\
      z-index: 9999;\
      left:10px;\
      bottom: 5px;\
      width: 30px;\
      height: 30px;\
      background-color: #ffffff;\
      border: solid 2px #0096ff;\
      font-family:\'微软雅黑\',Arial;\
      text-align:left;\
      color:#000000;\
      font-size:12px;\
      border-radius: 5px;\
      overflow: hidden;\
    }\
    #imagefinderpanel_right_title{\
      font-size: 15px;\
      line-height: 30px;\
      text-align: center;\
      background-color: #0096ff;\
      color: #ffffff;\
    }\
    #imagefinderpanel_right_img_area{\
      max-width: 100%;\
      height: 80px;\
      text-align: center;\
    }\
    #imagefinderpanel_right_message{\
      font-size: 15px;\
      line-height: 80px;\
      text-align: center\
    }\
    #imagefinderpanel_right_switch{\
      font-size: 15px;\
      text-align: center;\
      position: absolute;\
      right: 10px;\
      cursor: pointer;\
    }\
    #imagefinderpanel_right_url{\
      line-height: 15px;\
      width:98%;\
    }\
    #imagefinderpanel_right_img{\
      max-width: 100%;\
      max-height: 100%;\
    }\
    #imagefinderpanel_right_open{\
      width: 100px;\
      height: 33px;\
      line-height: 33px;\
      text-align:center;\
      border: solid 2px #0096ff;\
      color: #0096ff;\
      border-radius: 10px;\
      display: inline-block;\
      margin-left: auto;\
      margin-right: auto;\
      margin-top: 10px;\
      text-decoration: none;\
    }\
    #imagefinderpanel_right_open:hover{\
      border: solid 2px #ffffff;\
      color: #ffffff;\
      background-color: #0096ff;\
    }\
  </style>\
  <div id="imagefinderpanel_right">\
  <p id="imagefinderpanel_right_title">图</p>\
  <div id="imagefinderpanel_right_detail">\
    <div id="imagefinderpanel_right_img_area">\
      <img id="imagefinderpanel_right_img" src=""/> \
    </div> \
    <p>图片名称: <span id="imagefinderpanel_right_name"></span></p> \
    <p>图片尺寸: <span id="imagefinderpanel_right_size"><span id="width_pic">0</span>px * <span id="height_pic">0</span>px</span></p> \
    <p>图片地址: </p>\
     <textarea id="imagefinderpanel_right_url"></textarea>\
    <div style="text-align: center;"><a target="_blank" id="imagefinderpanel_right_open">新窗口打开</a></div> \
  </div>\
  <div id="imagefinderpanel_right_message">\
  </div>\
  </div>';
  $("body").after(div);
}

/***
 * 缩小查看面板
 * @constructor
 */
function HidePanel(){
  $("#imagefinderpanel_right").animate({height:"30px"},300);
  $("#imagefinderpanel_right").animate({width:"30px"},300);
  $("#imagefinderpanel_right_title").text("图");
  running = false;
  //写入本地存储
  localStorage['imagefinderpanel']= 'hidden';
}

/***
 * 放大查看面板
 * @constructor
 */
function ShowPanel(){
  $("#imagefinderpanel_right").animate({width:"200px"},300);
  $("#imagefinderpanel_right").animate({height:"250px"},300);
  $("#imagefinderpanel_right_title").text("图啥 控制面板（点击缩小）");
  running = true;
  //写入本地存储
  localStorage['imagefinderpanel']= 'show';
  ShowMessage("加载成功");
}
/**
 * 在控制面板上显示文字信息
 * @param msg 文字信息
 * @constructor
 */
function ShowMessage(msg) {
  if(running){
    //隐藏详情面板
    $("#imagefinderpanel_right_detail").hide();
    //显示信息面板
    $("#imagefinderpanel_right_message").text(msg).show();
  }
}

/**
 * 在控制面板上显示图片详细信息
 * @param name 图片名称
 * @param src 图片地址
 * @constructor
 */
function ShowDetail(name,src){
  if(running) {
    //隐藏信息面板
    $("#imagefinderpanel_right_message").hide();
    //显示详情面板
    $("#imagefinderpanel_right_detail").show();
    //图片缩略图
    $("#imagefinderpanel_right_img").attr("src", src).load(function () {
      //加载图片尺寸
      var img_clone = $(this).clone();
      $("#imagefinderpanel_right_size #width_pic").text(img_clone[0].width);
      $("#imagefinderpanel_right_size #height_pic").text(img_clone[0].height);
    });
    //图片名称
    $("#imagefinderpanel_right_name").text(name);
    //图片地址
    $("#imagefinderpanel_right_url").text(src);
    $("#imagefinderpanel_right_open").attr("href", src);
  }
}
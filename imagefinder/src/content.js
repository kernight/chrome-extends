/*用来注入页面的js文件*/
var panel_index= 9999;

console.log("图啥 加载成功");
$("body").after('<div id="imagefinderpanel" style="font-family:\'微软雅黑\',Arial;text-align:center;font-color:#000000;font-szie:12px;background-color:#ffffff;border:solid 2px #f0f0f0;z-index:'+(panel_index++)+';position:fixed;top:0;left:0;width:100%;height:50px;line-height:50px;vertical-align:top;overflow:hidden;"><span style="margin-right:30px;background-image:none;">图啥</span><span style="background-image:none;margin-left:10px;">加载成功</span></div>');
setTimeout(function(){$("#imagefinderpanel").remove();panel_index--;},500);
//当元素被右击，则进行捕捉
$("*").mousedown(function(e){
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
        console.log("从 img src 属性中获取");
      }else if(2 == from_index){
        console.log("从 DOM style 属性中获取");
      }else if(3 == from_index){
        console.log("从 css background 属性中获取");
      }else if(4 == from_index){
        console.log("从  css background-image 属性中获取");
      }

      //去除url前缀
      imgsrc = RemoveOther(imgsrc);
      console.log("找到的图片地址："+imgsrc);
      $("body").after('<div id="imagefinderpanel" style="font-family:\'微软雅黑\',Arial;text-align:center;font-color:#000000;font-szie:12px;background-color:#ffffff;border:solid 2px #f0f0f0;z-index:'+(panel_index++)+';position:fixed;top:0;left:0;width:100%;height:50px;line-height:50px;vertical-align:top;overflow:hidden;"><span style="margin-right:30px;background-image:none;">图啥</span><img style="display:inline-block;max-width:50%;max-height:30px;" src="'+imgsrc+'" /><span style="background-image:none;margin-left:10px;">'+imgsrc+'</span><a target="_blank"  style="color:#3498db;display:inline-block;width:100px;height:30px;line-height:3 0px;" href="'+imgsrc+'">点击打开</a></div>');
      setTimeout(function(){$("#imagefinderpanel").remove();panel_index--;},3000);
      return false;
    }
    console.log("未找到图片");
    $("body").after('<div id="imagefinderpanel" style="font-family:\'微软雅黑\',Arial;text-align:center;font-color:#000000;font-szie:12px;background-color:#ffffff;border:solid 2px #f0f0f0;z-index:'+(panel_index++)+';position:fixed;top:0;left:0;width:100%;height:50px;line-height:50px;vertical-align:top;overflow:hidden;"><span style="margin-right:30px;background-image:none;">图啥</span><span style="background-image:none;margin-left:10px;">未找到图片</span></div>');
    setTimeout(function(){$("#imagefinderpanel").remove();panel_index--;},500);
    return false;
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
    var domain = "";
   if(str.search(/.*:*\/\/.[^\/]*\//)){
     domain = window.location.href;
     domain = domain.match(/.*:*\/\/.[^\/]*\//,"")[0];
   }


   return domain+str;
 }

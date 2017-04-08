
var partner_name  = 'zsxn';
var partner_id = '09ecff36-b3a8-1695-1df7-f37083f74b1a';
var partner_path  = partner_name+'-'+partner_id;
var partner_home  = 'https://hms-sit.test-cignacmb.com/sit-hms-cmb/http/biyan_survey/';
var haola_home    = 'https://www.ihaola.com.cn/';
var survey_list   = ['biyan'];

var survey_ids = [
  '9da8a5ce-4fc7-edb0-ba97-415223582b12' // 2 鼻炎
];

//var share_url = partner_home + '/s.html';
var zs_share_url0 = partner_home+'biyan/launching.html?openid=followzsxn';

var survey_info = {
  '9da8a5ce-4fc7-edb0-ba97-415223582b12': {
    type             : "鼻炎",
    info             : "鼻炎困扰：缓解不适总有方，病友请入",
    share_title      : '3分钟鼻炎体检',
    share_descr      : '10人里有1人患有鼻炎，你知道自己适用哪种缓解方法吗？',
    share_img_url    : haola_home+'images/by2.jpg',
    share_url        : zs_share_url0,
    survey_page      : partner_home+'survey.html',
    result_page      : partner_home+'result.html',
    survey_page_title: '3分钟测鼻炎',
    result_page_title: '我的鼻炎',
    css_style        : 1,
    index_style      : 1,
    zb_style         : 1
  }
};

function getUrlVars() {
  var vars   = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?')+1).split('&');
  for ( var i = 0; i < hashes.length; i++ ) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

var survey_infos  = [
  { info : survey_info[survey_ids[0]].info, url : survey_info[survey_ids[0]].survey_page }
];

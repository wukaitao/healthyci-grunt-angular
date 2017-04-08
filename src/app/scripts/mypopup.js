
// var fristPopup 			= true;
var currentTop;

$(function(){
	popupInit();
});
var popUpHistoryList 	= [];

function popupReset(){
	var popupdiv=$("div[data-role='mypopup']");
	popupdiv.remove();
}
function popupCreate(){
	return '<div data-role="mypopup" id="generic" class="mypopup clear-gutter" data-width="90%" data-height="90%" data-showtitle="true" data-title="" data-mode="true"><iframe data-src="" data-language="true" width="100%" height="99%" frameborder="0"></iframe></div>' 
			+'<div data-role="mypopup" id="generic_fullwin" class="mypopup clear-gutter" data-width="100%" data-height="100%" data-showtitle="false" data-title="" data-mode="true"><iframe data-src="" width="100%" height="99%"  frameborder="0"></iframe><H2 class="fullpage_close" onclick="javascript:closePopup(\'#generic_fullwin\');">X</H2></div>';
}

function popupInit(){
	var popupdiv=$("div[data-role='mypopup']");
	$.each(popupdiv,function(){
		var iframe=$(this).html();
		$(this).empty();
		var iframewrap='<div class="iframewrap"></div>';
		//dialog content
		var wrapcontent='<div class="dialogcontent">'+iframe+'</div>'
		var btncancel='<button class="dialogbtn btncancel" onclick="closePopup(\''+'#' + $(this).attr("id")+'\')">cancel</button>';
		var btnok='<button class="dialogbtn btnok" onclick="closePopup(\''+'#' + $(this).attr("id")+'\')">ok</button>';
		var wrapmin='<div class="wrapmin" onclick="killEvent(event);">';

		
		var wraptitle='<div class="pwraptitle" onclick="killEvent(event);" style="width: '+$(this).attr("data-width")+';table-layout: fixed;display: table;"></div>';
		var wraptitleMiddle = '<div style="width: auto; display: table-cell; line-height: 1; vertical-align: middle;" class="title-h1 pwraptitle-content"></div>';
		var backbtn='<div style="width: 30px; display: table-cell;"><label class="backbtn"></label></div>';
		var closebtn='<div style="width: 30px; display: table-cell;"><i class="closebtn icon-wrong" onclick="window.top.popupHistoryReset(); javascript:closePopup(\'#'+$(this).attr("id")+'\');"></i></div>';
		$('.backbtn').hide();
		bindBackButtonEvent();
		if($(this).hasClass("dialogpopup")){
			if($(this).hasClass("commit"))
				wrapmin += wrapcontent+btncancel+btnok+'</div>';
			else
				wrapmin += wrapcontent+btnok+'</div>';
		}else{
			wrapmin += iframe+'</div>';
		}
		$(this).append(iframewrap);
		var tempiframewrap=$(this).find(".iframewrap");
		var width=$(this).attr("data-width");
		var height=$(this).attr("data-height");
		if($(this).attr("data-showtitle")=="true"){
			tempiframewrap.append(wraptitle);
			var pwrap=$(this).find(".pwraptitle");
			pwrap.append(backbtn);
			pwrap.append(wraptitleMiddle);
			if(width=="100%"||height=="100%"){
				$(this).append(closebtn);
			}else{
				pwrap.append(closebtn);
			}
			setPopupTitle(this);
		}
		tempiframewrap.append(wrapmin);
		$(this).find(".wrapmin").css("width",width);
		$(this).find(".wrapmin").css("height",height);
		
		$(this).on("click", function(e) {
			if($(e.currentTarget).attr("data-mode") == "true") {
				closePopup("#" + $(this).attr("id"));
				popupHistoryReset();
			}
		});
		
		$(this).detach().appendTo("body");
	});
	var popupa=$("*[data-rel='mypopup']");
	popupa.bind("click",initHref);
}
function initHref(e){
	var href=$(this).attr("data-href");
	showPopup(href);
	e.preventDefault();
	e.stopPropagation();
}
function killEvent(e){
	e.preventDefault();
	e.stopPropagation();
}

function showPopup( data ) {
	$(data).parent().attr('style','position:fixed');
		if (window.addEventListener) {
            document.addEventListener('touchmove', function (e) { window.event.returnValue = true; }, false);
        } else if (window.attachEvent) {
                    //适用用IE浏览器
            document.attachEvent('touchmove', function (e) { window.event.returnValue = true; });
                    
        }
		
	
	//debugger;
	document.activeElement.blur();
	   		setTimeout(function(){
	  			window.scrollTo(0, 0);
	  			var innerHeight = window.innerHeight;
				var htmlHeight = $("html").height();
				if (htmlHeight != innerHeight) {
					$("html").height(innerHeight);
				}
			}, 0);
	var frame, dir, checkFAQ;
	
	// do nothing and return if no target
	if($(data).length == 0) {
		//$.bochkCore.progressIndicator.remove('bochkCore.showPopup');
		return;
	}
	
	// basic style for overlay
	currentTop=window.scrollY;
	//$(document.body).css("width","100%");
	//$(document.body).css("height","100%");
	//$(document.body).css("top","-"+currentTop+"px");	
	//$(document.body).css("position","fixed");	
	//$("body").css("overflow","hidden");
	// set popup title
	if( $(data).attr("data-showtitle")=="true") {
		setPopupTitle(data);
	}
	
	// type specfic handle
	frame = $(data).find('iframe');

	if(!frame[0]){
		// set style for popup
		if(!window.navigator.userAgent.match('MSIE 7.')){
				$(data).css("display","table");
			}else{
				$(data).css("display","block");
			}
	}
	else{
		// set opacity
		frame.css("opacity", 0);
		
		// open progress indicator
		//$.bochkCore.progressIndicator.add('bochkCore.showPopup');

		dir = frame.attr("data-src");	
		// checkFAQ - should it be called outside showPopup()? 
		//var checkFAQ = fnMenuGoTo('FAQ');
		//if( typeof fnMenuGoTo('FAQ') == 'object' && dir == fnMenuGoTo('FAQ').url ) {
		//	popupHistoryReset();
		//}
		
		// set src
		frame.attr("src", dir);

		// set event
		frame.off("load").on("load", function(){
			// set style for popup
			if(!window.navigator.userAgent.match('MSIE 7.')){
				$(data).css("display","table");
			}else{
				$(data).css("display","block");
			}

			// reset opacity
			frame.css("opacity", 1);
			// autoRefreshOverlay.autoRefreshOverlayHeight($(data));
			
			// release indicator
			//$.bochkCore.progressIndicator.remove('bochkCore.showPopup');
		});
	}
}

var autoRefreshOverlay = {

	autoRefreshAllVisibleOverlayHeights : function() {
		var popups = $("[data-role=mypopup]");
		$.each(popups, function() {
			if ( $(this).is(":visible") && $(this).css("visibility") !== "hidden" ) {
				console.log("REFRESH:", $(this));
				autoRefreshOverlay.autoRefreshOverlayHeight($(this));
			}
		});
	},


	autoRefreshOverlayHeight : function(popupClassDiv) {
	}
}

function setPopupTitle(selector) {
	$(selector).find(".pwraptitle-content").html($(selector).attr("data-title"));
}


function closePopup(data){	
	$(data).parent().removeAttr('style');
	var isIscrollDiv=$("#view-wrapper")[0];
	if(!isIscrollDiv){
		if (window.addEventListener) {
            document.addEventListener('touchmove', function (e) { window.event.returnValue = true; }, false);
        } else if (window.attachEvent) {
                    //适用用IE浏览器
            document.attachEvent('touchmove', function (e) { window.event.returnValue = true; });
                    
        }
		
	}
	$(document.body).css("width","");
	$(document.body).css("height","");
	//$(document.body).css("position","");
	//$(document.body).css("top","");	
	//window.scrollTo(0,currentTop)
	//$("body").css("overflow","");
	var input="<input type='text' id='hiddeninput'/>"
	$(data).prepend(input);
	$("#hiddeninput").focus();
	$("#hiddeninput").blur();
	$("#hiddeninput").remove();
	$(data).css("display","none");
	var frame=$(data).find('iframe');
	$(frame).unbind("load");
	frame.attr("src","");
}

function popUpPageForward( patchGoto, backPath ) 
{
	if( !backPath ) backPath = 'FAQ';

	var back 	= $('.backbtn');
	back.show();

	addPopupHistory( backPath );
	window.top.changePage( fnMenuGoTo(patchGoto) );  
};


function bindBackButtonEvent() {
	var back 	= $('.backbtn');

	back.off("click").on("click", function() 
	{
		if( popUpHistoryList && popUpHistoryList.length <= 1) {
			var back 	= $('.backbtn');
			back.hide();
		}

		window.top.changePage( getPopupHistory() );

	});
}


function addPopupHistory(path) {
	if(popUpHistoryList) popUpHistoryList.push(path);
};


function getPopupHistory() {
	if( !popUpHistoryList || popUpHistoryList && popUpHistoryList.length == 0) return fnMenuGoTo('FAQ')

	return fnMenuGoTo( popUpHistoryList.pop() );
};

function popupHistoryReset() {
	var back 	= $('.backbtn');
	back.hide();
	popUpHistoryList = [];
	fristPopup = true;
	if(window.top.stepIntoFAQLevel2) window.top.stepIntoFAQLevel2.isStepIntoFAQLevel2 = true;
}

;(function(win,doc){

    function _isWeixn(){
        var _ua = navigator.userAgent.toLocaleLowerCase();
       return !!_ua.match(/micromessenger/ig);
    }
    function _insertScript(type,fname,cb){
        var isCss = (type == 'css'),
            _tag = isCss?'link':'script';
            _pos = isCss?'head':'body',
            _attrs = isCss?{rel:"stylesheet",type:"text/css",href:fname}:{src:fname},
            _$file = document.createElement(_tag);
            
        for(var o in _attrs){
             _$file.setAttribute(o,_attrs[o]);
        }
        document[_pos].appendChild(_$file);
        _$file.onload = function(){
            cb && cb();
             _$file.onload = null;
        }
    }
    function ajaxJsonp(url,name,error){
        var _script = document.createElement('script');
        _script.src = url;
        _script.charset = 'utf-8';
        _script.className = name || 'dataContainer';
        _script.onerror = error;
        doc.body.appendChild(_script);

        clearAjaxDom(_script.className);
        
        return _script;
    }
	function clearAjaxDom(_name){
        var name = _name || 'dataContainer',
            _$allS =  document.querySelector('.'+name);
            
        setTimeout(function(){
            _$allS && Array.prototype.slice.call(_$allS).forEach(function(item) {
                item.remove();
            }, this);
        },200);
    }
    function checkCB(re){
        var _info = re && JSON.stringify(re),
            isOk = _info && _info.match(/(confirm|ok)/),
            _shareFinsh = typeof sinaCnShare != 'undefined' && sinaCnShare.shareWeiboFinish || false;
        isOk && _shareFinsh && _shareFinsh.finishCB();
    }
    function getWShareInfo(type,_config){
        return {
				title: _config.shareInfo.title || '', // 分享标题
				desc: _config.shareInfo.desc || '', // 分享描述
				link: _config.shareInfo.link || window.location.href, // 分享链接
				imgUrl: _config.shareInfo.imgUrl || '', // 分享图标
				type: _config.shareInfo.type || '', // 分享类型,music、video或link，不填默认为link
				dataUrl: _config.shareInfo.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function (re) { 
					// 用户确认分享后执行的回调函数
					//alert('share '+type+' success!');
                    checkCB(re);
				},
				cancel: function (re) { 
					// 用户取消分享后执行的回调函数
					//alert('share '+type+' cancel!');
                    checkCB(re);
				}
			}
    }
    function goCheckWx(){
        var _config = _wxConfig || {} ;
        if(!_config.init){return;}
        wx.config(_config.init);

		wx.ready(function(){
			//alert('test');
			wx.onMenuShareAppMessage(getWShareInfo('onMenuShareAppMessage',_config));
			wx.onMenuShareTimeline(getWShareInfo('onMenuShareTimeline',_config));

   		});
        wx.error(function(res){
            //alert(JSON.stringify(res));
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
    }
    var shareInfoType = {
        title:'title',desc:'desc',link:'link',imgUrl:'imgUrl',type:'type',dataUrl:'dataUrl'
    };
    function getShareImg(){
        var _$sWxImg = document.querySelector('.sWxImg'),
            _fixedImg = document.querySelector('[rel="apple-touch-icon-precomposed"]'),
            _defaultImg = document.location.protocol + "//mjs.sinaimg.cn/wap/online/public/images/addToHome/sina_114x114_v1.png",
            _sWxImgUrl = '';

        if(!_$sWxImg){
            return (_fixedImg && _fixedImg.href) || _defaultImg;
        }

        if(_$sWxImg.tagName == 'IMG'){
            _sWxImgUrl = _$sWxImg.src;
        }else{
            _$sWxImg = _$sWxImg.querySelector('img');
            _sWxImgUrl = _$sWxImg && _$sWxImg.src || '';
        }

        return _sWxImgUrl || (_fixedImg && _fixedImg.href)||_defaultImg;
    }
    function getShareInfo(){
        var _sConfig = typeof _wxShareConfig != 'undefined' && _wxShareConfig || {},
            _$description = document.querySelector('[name="description"]'),
            _defaultImg = getShareImg();

        return {
            title: (_sConfig && _sConfig.title) || document.title || '', // 分享标题
            desc: (_sConfig && _sConfig.desc) || (_$description && _$description.content) || '', // 分享描述
            link: (_sConfig && _sConfig.link) || window.location.href, // 分享链接
            imgUrl: (_sConfig && _sConfig.imgUrl) || _defaultImg, // 分享图标
            type: (_sConfig && _sConfig.type) ||'', // 分享类型,music、video或link，不填默认为link
            dataUrl: (_sConfig && _sConfig.dataUrl) ||'', // 如果type是music或video，则要提供数据链接，默认为空
                
        }
    }
    window.setWSignCB = function(data){
        if(typeof data != 'undefined' && parseInt(data.status) == 0 && data.data){
            var _info = data.data,
                _finalPath = document.location.protocol + '//res.wx.qq.com/open/js/jweixin-1.0.0.js',
                _shareInfo = getShareInfo();

            window._wxConfig = {
                init : {
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: _info.appid || '', // 必填，公众号的唯一标识
                        timestamp: _info.time || 0, // 必填，生成签名的时间戳
                        nonceStr: _info.nonceStr || '', // 必填，生成签名的随机串
                        signature: _info.signature || '',// 必填，签名，见附录1
                        jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                },
                shareInfo : _shareInfo
            }
            console.log(_wxConfig);
            _insertScript( 'js', _finalPath, goCheckWx);
        }
    }
    function getSignInfo(){
        var _ajaxUrl = document.location.protocol + '//mp.sina.cn/aj/wechat/gettoken?url='+encodeURIComponent(window.location.href)+'&callback=setWSignCB'
        ajaxJsonp( _ajaxUrl );
    }
    window.shareInit = function(){
        // console.log(2222)
        var _isWx = _isWeixn();
        _isWx && getSignInfo();
    }
    // init();
})(window,document)

// var _wxShareConfig = {
//     title: '韩青瓦台：将证明朴槿惠无罪_手机新浪网', // 分享标题
//     desc: '原标题：韩青瓦台：将通过特检调查证明朴槿惠无罪中新网11月21日电据韩媒报道，韩国检方20日发表了“亲信门”的中间调查结...', // 分享描述
//     link: 'http://news.sina.cn/2016-11-21/detail-ifxxwmws3351199.d.html?vt=4&pos=108', // 分享链接
//     imgUrl: 'http://n.sinaimg.cn/translate/20161121/gWyK-fxxxauy0636236.jpg', // 分享图标
//     type: '', // 分享类型,music、video或link，不填默认为link
//     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
// }
// var _wxConfig = {
//     init : {
// 			debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
// 			appId: 'wx169b00793f878ec7', // 必填，公众号的唯一标识
// 			timestamp: 1479969878, // 必填，生成签名的时间戳
// 			nonceStr: 'Wm3CZSPPg9cseesbI', // 必填，生成签名的随机串
// 			signature: 'edd0f0239d306cf46d42cb69b0def4fbd92159cf',// 必填，签名，见附录1
// 			jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//     },
//     shareInfo : {
//         title: '韩青瓦台：将证明朴槿惠无罪_手机新浪网', // 分享标题
//         desc: '原标题：韩青瓦台：将通过特检调查证明朴槿惠无罪中新网11月21日电据韩媒报道，韩国检方20日发表了“亲信门”的中间调查结...', // 分享描述
//         link: 'http://news.sina.cn/2016-11-21/detail-ifxxwmws3351199.d.html?vt=4&pos=108', // 分享链接
//         imgUrl: 'http://n.sinaimg.cn/translate/20161121/gWyK-fxxxauy0636236.jpg', // 分享图标
//         type: '', // 分享类型,music、video或link，不填默认为link
//         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//     }
// }
//http://mp.sina.com.cn/aj/wechat/gettoken?url=http:www.baidu.com
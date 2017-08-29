import iframeMessenger from 'guardian/iframe-messenger'
import reqwest from 'reqwest'
import embedHTML from './text/embed.html!text'
import pannellum from './lib/pannellum-dev' 
import libpannellum from './lib/libpannellum'

window.init = function init(el, config) {

    iframeMessenger.enableAutoResize();

    el.innerHTML = embedHTML;

    var para = {
        "a": "https://interactive.guim.co.uk/uploader/embed/2017/07/archive-zip/giv-3902qIfHDLGXaDrj/pano1.JPG",
        "b": 1,
        "c": -135.4,
        "d": 120
    };

	(getPano()) ? para = getPano() : '' ;

    console.log(para.a)

    var mobile = {
        "type": "equirectangular",
        "panorama": para.a,
        "compass":false,
        "orientationOnByDefault": true,
        "autoLoad":true,
        "draggable":false
    };

    var viewer = pannellum.viewer('panorama', mobile);

};

function getPano(){

    var urlParams; 
    var params = {};

    urlParams = window.location.search.substring(1).split('&');
    
    urlParams.forEach(function(param){
     
        if (param.indexOf('=') === -1) {
            params[param.trim()] = true;
        } else {
            var pair = param.split('=');
            params[ pair[0] ] = pair[1];
        }
        
    });

    return (params.a) ? params : false
    
}
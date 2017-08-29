import reqwest from 'reqwest'
import $ from './lib/jquery'
import mainHTML from './text/main.html!text'
import share from './lib/share'
import { pannellum } from './lib/pannellum'


var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config, mediator) {

    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    /*
    // Used for testing output of console log on apps.

    var logs = document.getElementById('console_panel');

    console.log = function(message) {

        logs.innerHTML += '<p>' + message + '</p>';

    };

    console.error = console.debug = console.info =  console.log

    */

    var panapoly = {

        listening: null,

        gyrocheck: null,

        gyro: null,

        prompt: 'Click on the image (or tilt your mobile) for a 360 degree view',

        initialize: function() {

            var isMobile = panapoly.mobileCheck();

            if (panapoly.listening == null) {

                panapoly.listening = true;

                if (isMobile) {

                    window.addEventListener("devicemotion", function(event) {

                        panapoly.gyro = (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma) ? true : false ;

                    });

                    (panapoly.gyro == null) ? panapoly.gyroStart() : panapoly.gyroSwitch() ;

                } else {

                    panapoly.gyro = false;

                    panapoly.gyroSwitch();

                }

            }
            
        },

        mobileCheck: function() {
            var check = false;
            (function(a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
            })(navigator.userAgent || navigator.vendor || window.opera);
            var isiPad = navigator.userAgent.match(/iPad/i) != null;
            return (check || isiPad ? true : false);
        },

        createPano: function() {

            var para = {
                "a": "https://interactive.guim.co.uk/uploader/embed/2017/07/archive-zip/giv-3902qIfHDLGXaDrj/pano1.JPG",
                "b": 1,
                "c": -135.4,
                "d": 120
            };

            $( ".panorama" ).each(function( index ) {

              if ($(this).attr('id') == undefined) {

                $(this).attr('id', "panorama_" + index);

                    (panapoly.getPano(index)) ? para = panapoly.getPano(index) : '' ;               

                    var mobile = {
                        "type": "equirectangular",
                        "panorama": para.a,
                        "compass":false,
                        "orientationOnByDefault": true,
                        "autoLoad":true,
                        "draggable":false
                    };

                    var desktop = {
                        "type": "equirectangular",
                        "panorama": para.a,
                        "compass":false,
                        "autoLoad":true,
                        "pitch": para.b,
                        "yaw": para.c,
                        "hfov": para.d
                    };

                    var settings = (panapoly.gyro) ? mobile : desktop ;

                    var viewer = pannellum.viewer('panorama_' + index, settings);

                    console.log(panapoly.prompt)

                    $(this).parent().append('<div class="propmted">' + panapoly.prompt + '</div>')

                }

            });



        },

        getPano: function(index) {

            var urlParams; 
            var params = {};

            var elements = document.getElementsByClassName('element-interactive');
            var el = elements[index];

            try {

                urlParams = el.getAttribute('data-alt').split('&');

            } catch(err) {

                console.log("Params: " + err)

            }
            

            if (urlParams) {

                urlParams.forEach(function(param){
                 
                    if (param.indexOf('=') === -1) {
                        params[param.trim()] = true;
                    } else {
                        var pair = param.split('=');
                        params[ pair[0] ] = pair[1];
                    }
                    
                });

            }
            
            return (params.a && params.b && !isNaN(params.b) && params.c && !isNaN(params.c) && params.d && !isNaN(params.d)) ? params : false
            
        },

        gyroStart: function() {
            panapoly.gyrocheck = setInterval(function() { 
                if (panapoly.gyro!=null) {
                    panapoly.gyroStop();
                }
            }, 250);
        },

        gyroStop: function() {
            clearInterval(panapoly.gyrocheck);
            panapoly.gyroSwitch();
        },

        gyroSwitch: function() {

            var isApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent) || window.location.origin === "file://" && /(iPad)/i.test(navigator.userAgent)) ? true : false;

            (isApp) ? panapoly.panoIframe() : panapoly.createPano();

        },

        panoIframe: function() {

            $( ".panorama_block" ).each(function( index ) {

              if ($(this).attr('id') == undefined) {

                $(this).attr('id', "panorama_block_" + index);

                    var para_block = {
                        "a": "https://interactive.guim.co.uk/uploader/embed/2017/07/archive-zip/giv-3902qIfHDLGXaDrj/pano1.JPG",
                        "b": 1,
                        "c": -135.4,
                        "d": 120
                    };

                    (panapoly.getPano(index)) ? para_block = panapoly.getPano(index) : '';                    

                    var iframe_block = '<iframe src="https://interactive.guim.co.uk/testing/2017/07/360-photo-viewer/embed/embed.html?a=' + para_block.a +'" width="100%" height="300"></iframe>';

                    iframe_block += '<div class="propmted">' + panapoly.prompt + '</div>'

                    $(this).html(iframe_block);

                }


            });

        }

    }

    panapoly.initialize();

}





$(function() {
    loadphotograph();
});


var letStore = {};
var userAdd = {};

function loadphotograph() {

    var isAuto = false;
    var eventid = "";
    $("#webcam").scriptcam({
        width: 320,
        height: 240,
        showDebug: true,
        //显示麦克风错误
        showMicrophoneErrors: false,
        //圆角半径
        cornerRadius: 0,
        //onWebcamReady: onWebcamReady,
        //圆角颜色
        cornerColor: 'e3e5e2',
        path: 'lib/scriptcam/'
    });
    $(".btn_lz").click(function() {
        var fn = this.getAttribute("fn");
        ($.type(window[fn]) == "function") && window[fn]();
    })
}

//拍照截图
function captureimage() {
    var image = letStore.imgBinary = $.scriptcam.getFrameAsBase64();
    var url = letStore.imgUrl = "data:image/jpeg;base64," + image;
    $("#imgtailor").attr("src", url);
    $("#imgpractical").attr("src", url)
        .on("load", function() {
            loadscreenshot();
        });
}

function loadscreenshot() {

    var jcrop_api,

        // Grab some information about the preview pane
        $preview = $('#preview-pane'),
        $pcnt = $('#preview-pane .preview-container'),
        $pimg = $('#imgtailor'),

        xsize = $pcnt.width(),
        ysize = $pcnt.height(),

        $img = $('#imgpractical');
    if ($img.data('Jcrop')) {
        letStore.jcrop.setImage(letStore.imgUrl);
    }
    $img.Jcrop({
        boxWidth: 380,
        boxHeight: 300,
        allowSelect: false, //不允许新选框
        setSelect: [0, 0, 97, 115],
        onChange: updatePreview,
        onSelect: updatePreview,
        aspectRatio: (97 / 115)
    }, function() {
        // Use the API to get the real image size
        var bounds = this.getBounds();
        letStore.boundx = bounds[0];
        letStore.boundy = bounds[1];
        // Store the API in the jcrop_api variable
        jcrop_api = letStore.jcrop = this;

        // Move the preview into the jcrop container for css positioning
        $preview.appendTo(jcrop_api.ui.holder);
    });

    function updatePreview(c) {
        if (parseInt(c.w) > 0) {
            var rx = 97 / c.w;
            var ry = 115 / c.h;

            $pimg.css({
                width: Math.round(rx * letStore.boundx) + 'px',
                height: Math.round(ry * letStore.boundy) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
            });
        }
        //剪切照片
        letStore.cutPosition = {
            cutX: parseInt(c.x),
            cutY: parseInt(c.y),
            cutWidth: parseInt(c.w),
            cutHeight: parseInt(c.h)
        };
    };
}

var Canvas = require('canvas');
var urlParse = require("url").parse;
var _ = require("underscore")._;

var getCode = function(length, type) {
    if (type > 4) type = 5;

    var code = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    var types = [[0, 9], [10, 35], [36, 61], [0, 35], [10, 61], [0, 61]];

    var ret = "";

    type = types[type];
    for(var i = 0; i < length; i ++) {
        ret = ret + code.substr(_.random(type[0], type[1]),1);
    }
    return ret;
}

/*
 var weights = 'normal|bold|bolder|lighter|[1-9]00'
 , styles = 'normal|italic|oblique'
 */

module.exports = function (params) {
    if(typeof params == 'string')
        params = { url: params };

    params.background = params.background || 'rgb(235,235,255)';

    params.length = params.length || 4;
    params.type = params.type || 4;
    params.width = params.width || 78;
    params.height = params.height || 35;
    params.font = params.font || {};
    params.font.family = params.font.family || "Helvetica";
    params.font.size = params.font.size || 18;
    params.font.style = params.font.style || "normal";
    params.font.weight = params.font.weight || "normal";
    params.dx = params.dx || 8;
    params.dy = params.dy || 24;
    params.letterSpacing = params.letterSpacing || 16;

    //params.obstructionist = params.obstructionist || 3;


    return function(req, res, next){
        if(urlParse(req.url).pathname != params.url)
            return next();

        var canvas = new Canvas(params.width, params.height);
        var ctx = canvas.getContext('2d');
        ctx.antialias = 'gray';
        ctx.fillStyle = params.background;
        ctx.fillRect(0, 0, params.width, params.height);

        ctx._setFont(params.font.weight, params.font.style, params.font.size, "px", params.font.family);

        var text = getCode(params.length, params.type);

        for (i = 0; i < text.length; i++) {
            var color = "rgb(" + _.random(20, 200) + "," + _.random(20, 200) + "," + _.random(20, 200) + ")";
            ctx.fillStyle = color;
            ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, params.letterSpacing * i + params.dx, params.dy);
            ctx.fillText(text.charAt(i), 0, 0);
        }

        canvas.toBuffer(function(err, buf) {
            if(req.session)
                req.session.captcha = text;
            res.end(buf);
        });
    };
}

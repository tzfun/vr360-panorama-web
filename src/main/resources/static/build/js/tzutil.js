// 序列化表单，将其转化为json格式
$.fn.serializeJson = function() {
    var arr = this.serializeArray();
    var json = {};
    arr.forEach(function(item) {
        var name = item.name;
        var value = item.value;

        if (!json[name]) {
            json[name] = value;
        } else if ($.isArray(json[name])) {
            json[name].push(value);
        } else {
            json[name] = [json[name], value];
        }
    });
    return json;
}
//cookie工具类
var cookiesUtil = function (){
    //s20是代表20秒
    //h是指小时，如12小时则是：h12
    //d是天数，30天则：d30

    //创建cookie
    this.setCookie=function(name,value,time){
        var strsec = getSec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec*1);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    //解析字符串
    function getSec(str){
        var str1=str.substring(1,str.length)*1;
        var str2=str.substring(0,1);
        if (str2=="s")
        {
            return str1*1000;
        }
        else if (str2=="h")
        {
            return str1*60*60*1000;
        }
        else if (str2=="d")
        {
            return str1*24*60*60*1000;
        }
    }
    //获取cookie
    this.getCookie=function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    //删除cookie
    this.delCookie=function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=this.getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
}
//md5加密工具类
function md5Util(){
    /*
    * Configurable variables. You may need to tweak these to be compatible with
    * the server-side, but the defaults work in most cases.
    */
    var hexcase = 0;
    /* base-64 pad character. "=" for strict RFC compliance   */
    var chrsz = 8;
    /* bits per input character. 8 - ASCII; 16 - Unicode      */

    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    this.hex_md5 = function (s) {
        return binl2hex(core_md5(str2binl(s), s.length * chrsz));
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    function core_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);

    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */
    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    }

    /*
     * Convert an array of little-endian words to a hex string.
     */
    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }
}
    !function(t,n){"object"==typeof exports?module.exports=exports=n():"function"==typeof define&&define.amd?define([],n):t.CryptoJS=n()}(this,function(){var t=t||function(t,n){var i=Object.create||function(){function t(){}return function(n){var i;return t.prototype=n,i=new t,t.prototype=null,i}}(),e={},r=e.lib={},o=r.Base=function(){return{extend:function(t){var n=i(this);return t&&n.mixIn(t),n.hasOwnProperty("init")&&this.init!==n.init||(n.init=function(){n.$super.init.apply(this,arguments)}),n.init.prototype=n,n.$super=this,n},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),s=r.WordArray=o.extend({init:function(t,i){t=this.words=t||[],i!=n?this.sigBytes=i:this.sigBytes=4*t.length},toString:function(t){return(t||c).stringify(this)},concat:function(t){var n=this.words,i=t.words,e=this.sigBytes,r=t.sigBytes;if(this.clamp(),e%4)for(var o=0;o<r;o++){var s=i[o>>>2]>>>24-o%4*8&255;n[e+o>>>2]|=s<<24-(e+o)%4*8}else for(var o=0;o<r;o+=4)n[e+o>>>2]=i[o>>>2];return this.sigBytes+=r,this},clamp:function(){var n=this.words,i=this.sigBytes;n[i>>>2]&=4294967295<<32-i%4*8,n.length=t.ceil(i/4)},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(n){for(var i,e=[],r=function(n){var n=n,i=987654321,e=4294967295;return function(){i=36969*(65535&i)+(i>>16)&e,n=18e3*(65535&n)+(n>>16)&e;var r=(i<<16)+n&e;return r/=4294967296,r+=.5,r*(t.random()>.5?1:-1)}},o=0;o<n;o+=4){var a=r(4294967296*(i||t.random()));i=987654071*a(),e.push(4294967296*a()|0)}return new s.init(e,n)}}),a=e.enc={},c=a.Hex={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;r<i;r++){var o=n[r>>>2]>>>24-r%4*8&255;e.push((o>>>4).toString(16)),e.push((15&o).toString(16))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;e<n;e+=2)i[e>>>3]|=parseInt(t.substr(e,2),16)<<24-e%8*4;return new s.init(i,n/2)}},u=a.Latin1={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;r<i;r++){var o=n[r>>>2]>>>24-r%4*8&255;e.push(String.fromCharCode(o))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;e<n;e++)i[e>>>2]|=(255&t.charCodeAt(e))<<24-e%4*8;return new s.init(i,n)}},f=a.Utf8={stringify:function(t){try{return decodeURIComponent(escape(u.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return u.parse(unescape(encodeURIComponent(t)))}},h=r.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=f.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(n){var i=this._data,e=i.words,r=i.sigBytes,o=this.blockSize,a=4*o,c=r/a;c=n?t.ceil(c):t.max((0|c)-this._minBufferSize,0);var u=c*o,f=t.min(4*u,r);if(u){for(var h=0;h<u;h+=o)this._doProcessBlock(e,h);var p=e.splice(0,u);i.sigBytes-=f}return new s.init(p,f)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),p=(r.Hasher=h.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){h.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){t&&this._append(t);var n=this._doFinalize();return n},blockSize:16,_createHelper:function(t){return function(n,i){return new t.init(i).finalize(n)}},_createHmacHelper:function(t){return function(n,i){return new p.HMAC.init(t,i).finalize(n)}}}),e.algo={});return e}(Math);return t});
    //# sourceMappingURL=core.min.js.map
    !function(e,t,i){"object"==typeof exports?module.exports=exports=t(require("./core.min"),require("./sha1.min"),require("./hmac.min")):"function"==typeof define&&define.amd?define(["./core.min","./sha1.min","./hmac.min"],t):t(e.CryptoJS)}(this,function(e){return function(){var t=e,i=t.lib,r=i.Base,n=i.WordArray,o=t.algo,a=o.MD5,c=o.EvpKDF=r.extend({cfg:r.extend({keySize:4,hasher:a,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,t){for(var i=this.cfg,r=i.hasher.create(),o=n.create(),a=o.words,c=i.keySize,f=i.iterations;a.length<c;){s&&r.update(s);var s=r.update(e).finalize(t);r.reset();for(var u=1;u<f;u++)s=r.finalize(s),r.reset();o.concat(s)}return o.sigBytes=4*c,o}});t.EvpKDF=function(e,t,i){return c.create(i).compute(e,t)}}(),e.EvpKDF});
    //# sourceMappingURL=evpkdf.min.js.map
    !function(r,e){"object"==typeof exports?module.exports=exports=e(require("./core.min")):"function"==typeof define&&define.amd?define(["./core.min"],e):e(r.CryptoJS)}(this,function(r){return function(){function e(r,e,t){for(var n=[],i=0,o=0;o<e;o++)if(o%4){var f=t[r.charCodeAt(o-1)]<<o%4*2,c=t[r.charCodeAt(o)]>>>6-o%4*2;n[i>>>2]|=(f|c)<<24-i%4*8,i++}return a.create(n,i)}var t=r,n=t.lib,a=n.WordArray,i=t.enc;i.Base64={stringify:function(r){var e=r.words,t=r.sigBytes,n=this._map;r.clamp();for(var a=[],i=0;i<t;i+=3)for(var o=e[i>>>2]>>>24-i%4*8&255,f=e[i+1>>>2]>>>24-(i+1)%4*8&255,c=e[i+2>>>2]>>>24-(i+2)%4*8&255,s=o<<16|f<<8|c,h=0;h<4&&i+.75*h<t;h++)a.push(n.charAt(s>>>6*(3-h)&63));var p=n.charAt(64);if(p)for(;a.length%4;)a.push(p);return a.join("")},parse:function(r){var t=r.length,n=this._map,a=this._reverseMap;if(!a){a=this._reverseMap=[];for(var i=0;i<n.length;i++)a[n.charCodeAt(i)]=i}var o=n.charAt(64);if(o){var f=r.indexOf(o);f!==-1&&(t=f)}return e(r,t,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),r.enc.Base64});
    //# sourceMappingURL=enc-base64.min.js.map
    !function(e,t,r){"object"==typeof exports?module.exports=exports=t(require("./core.min"),require("./evpkdf.min")):"function"==typeof define&&define.amd?define(["./core.min","./evpkdf.min"],t):t(e.CryptoJS)}(this,function(e){e.lib.Cipher||function(t){var r=e,i=r.lib,n=i.Base,c=i.WordArray,o=i.BufferedBlockAlgorithm,s=r.enc,a=(s.Utf8,s.Base64),f=r.algo,p=f.EvpKDF,d=i.Cipher=o.extend({cfg:n.extend(),createEncryptor:function(e,t){return this.create(this._ENC_XFORM_MODE,e,t)},createDecryptor:function(e,t){return this.create(this._DEC_XFORM_MODE,e,t)},init:function(e,t,r){this.cfg=this.cfg.extend(r),this._xformMode=e,this._key=t,this.reset()},reset:function(){o.reset.call(this),this._doReset()},process:function(e){return this._append(e),this._process()},finalize:function(e){e&&this._append(e);var t=this._doFinalize();return t},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function e(e){return"string"==typeof e?B:x}return function(t){return{encrypt:function(r,i,n){return e(i).encrypt(t,r,i,n)},decrypt:function(r,i,n){return e(i).decrypt(t,r,i,n)}}}}()}),h=(i.StreamCipher=d.extend({_doFinalize:function(){var e=this._process(!0);return e},blockSize:1}),r.mode={}),u=i.BlockCipherMode=n.extend({createEncryptor:function(e,t){return this.Encryptor.create(e,t)},createDecryptor:function(e,t){return this.Decryptor.create(e,t)},init:function(e,t){this._cipher=e,this._iv=t}}),l=h.CBC=function(){function e(e,r,i){var n=this._iv;if(n){var c=n;this._iv=t}else var c=this._prevBlock;for(var o=0;o<i;o++)e[r+o]^=c[o]}var r=u.extend();return r.Encryptor=r.extend({processBlock:function(t,r){var i=this._cipher,n=i.blockSize;e.call(this,t,r,n),i.encryptBlock(t,r),this._prevBlock=t.slice(r,r+n)}}),r.Decryptor=r.extend({processBlock:function(t,r){var i=this._cipher,n=i.blockSize,c=t.slice(r,r+n);i.decryptBlock(t,r),e.call(this,t,r,n),this._prevBlock=c}}),r}(),_=r.pad={},v=_.Pkcs7={pad:function(e,t){for(var r=4*t,i=r-e.sigBytes%r,n=i<<24|i<<16|i<<8|i,o=[],s=0;s<i;s+=4)o.push(n);var a=c.create(o,i);e.concat(a)},unpad:function(e){var t=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=t}},y=(i.BlockCipher=d.extend({cfg:d.cfg.extend({mode:l,padding:v}),reset:function(){d.reset.call(this);var e=this.cfg,t=e.iv,r=e.mode;if(this._xformMode==this._ENC_XFORM_MODE)var i=r.createEncryptor;else{var i=r.createDecryptor;this._minBufferSize=1}this._mode&&this._mode.__creator==i?this._mode.init(this,t&&t.words):(this._mode=i.call(r,this,t&&t.words),this._mode.__creator=i)},_doProcessBlock:function(e,t){this._mode.processBlock(e,t)},_doFinalize:function(){var e=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){e.pad(this._data,this.blockSize);var t=this._process(!0)}else{var t=this._process(!0);e.unpad(t)}return t},blockSize:4}),i.CipherParams=n.extend({init:function(e){this.mixIn(e)},toString:function(e){return(e||this.formatter).stringify(this)}})),m=r.format={},k=m.OpenSSL={stringify:function(e){var t=e.ciphertext,r=e.salt;if(r)var i=c.create([1398893684,1701076831]).concat(r).concat(t);else var i=t;return i.toString(a)},parse:function(e){var t=a.parse(e),r=t.words;if(1398893684==r[0]&&1701076831==r[1]){var i=c.create(r.slice(2,4));r.splice(0,4),t.sigBytes-=16}return y.create({ciphertext:t,salt:i})}},x=i.SerializableCipher=n.extend({cfg:n.extend({format:k}),encrypt:function(e,t,r,i){i=this.cfg.extend(i);var n=e.createEncryptor(r,i),c=n.finalize(t),o=n.cfg;return y.create({ciphertext:c,key:r,iv:o.iv,algorithm:e,mode:o.mode,padding:o.padding,blockSize:e.blockSize,formatter:i.format})},decrypt:function(e,t,r,i){i=this.cfg.extend(i),t=this._parse(t,i.format);var n=e.createDecryptor(r,i).finalize(t.ciphertext);return n},_parse:function(e,t){return"string"==typeof e?t.parse(e,this):e}}),g=r.kdf={},S=g.OpenSSL={execute:function(e,t,r,i){i||(i=c.random(8));var n=p.create({keySize:t+r}).compute(e,i),o=c.create(n.words.slice(t),4*r);return n.sigBytes=4*t,y.create({key:n,iv:o,salt:i})}},B=i.PasswordBasedCipher=x.extend({cfg:x.cfg.extend({kdf:S}),encrypt:function(e,t,r,i){i=this.cfg.extend(i);var n=i.kdf.execute(r,e.keySize,e.ivSize);i.iv=n.iv;var c=x.encrypt.call(this,e,t,n.key,i);return c.mixIn(n),c},decrypt:function(e,t,r,i){i=this.cfg.extend(i),t=this._parse(t,i.format);var n=i.kdf.execute(r,e.keySize,e.ivSize,t.salt);i.iv=n.iv;var c=x.decrypt.call(this,e,t,n.key,i);return c}})}()});
    //# sourceMappingURL=cipher-core.min.js.map
    !function(e,i){"object"==typeof exports?module.exports=exports=i(require("./core.min")):"function"==typeof define&&define.amd?define(["./core.min"],i):i(e.CryptoJS)}(this,function(e){!function(){var i=e,t=i.lib,n=t.Base,s=i.enc,r=s.Utf8,o=i.algo;o.HMAC=n.extend({init:function(e,i){e=this._hasher=new e.init,"string"==typeof i&&(i=r.parse(i));var t=e.blockSize,n=4*t;i.sigBytes>n&&(i=e.finalize(i)),i.clamp();for(var s=this._oKey=i.clone(),o=this._iKey=i.clone(),a=s.words,f=o.words,c=0;c<t;c++)a[c]^=1549556828,f[c]^=909522486;s.sigBytes=o.sigBytes=n,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var i=this._hasher,t=i.finalize(e);i.reset();var n=i.finalize(this._oKey.clone().concat(t));return n}})}()});
    //# sourceMappingURL=hmac.min.js.map
    !function(e,o,r){"object"==typeof exports?module.exports=exports=o(require("./core.min"),require("./cipher-core.min")):"function"==typeof define&&define.amd?define(["./core.min","./cipher-core.min"],o):o(e.CryptoJS)}(this,function(e){return e.mode.ECB=function(){var o=e.lib.BlockCipherMode.extend();return o.Encryptor=o.extend({processBlock:function(e,o){this._cipher.encryptBlock(e,o)}}),o.Decryptor=o.extend({processBlock:function(e,o){this._cipher.decryptBlock(e,o)}}),o}(),e.mode.ECB});
    //# sourceMappingURL=mode-ecb.min.js.map
    !function(e,r,i){"object"==typeof exports?module.exports=exports=r(require("./core.min"),require("./cipher-core.min")):"function"==typeof define&&define.amd?define(["./core.min","./cipher-core.min"],r):r(e.CryptoJS)}(this,function(e){return e.pad.Pkcs7});
    //# sourceMappingURL=pad-pkcs7.min.js.map
    !function(e,r,i){"object"==typeof exports?module.exports=exports=r(require("./core.min"),require("./enc-base64.min"),require("./md5.min"),require("./evpkdf.min"),require("./cipher-core.min")):"function"==typeof define&&define.amd?define(["./core.min","./enc-base64.min","./md5.min","./evpkdf.min","./cipher-core.min"],r):r(e.CryptoJS)}(this,function(e){return function(){var r=e,i=r.lib,n=i.BlockCipher,o=r.algo,t=[],c=[],s=[],f=[],a=[],d=[],u=[],v=[],h=[],y=[];!function(){for(var e=[],r=0;r<256;r++)r<128?e[r]=r<<1:e[r]=r<<1^283;for(var i=0,n=0,r=0;r<256;r++){var o=n^n<<1^n<<2^n<<3^n<<4;o=o>>>8^255&o^99,t[i]=o,c[o]=i;var p=e[i],l=e[p],_=e[l],k=257*e[o]^16843008*o;s[i]=k<<24|k>>>8,f[i]=k<<16|k>>>16,a[i]=k<<8|k>>>24,d[i]=k;var k=16843009*_^65537*l^257*p^16843008*i;u[o]=k<<24|k>>>8,v[o]=k<<16|k>>>16,h[o]=k<<8|k>>>24,y[o]=k,i?(i=p^e[e[e[_^p]]],n^=e[e[n]]):i=n=1}}();var p=[0,1,2,4,8,16,32,64,128,27,54],l=o.AES=n.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var e=this._keyPriorReset=this._key,r=e.words,i=e.sigBytes/4,n=this._nRounds=i+6,o=4*(n+1),c=this._keySchedule=[],s=0;s<o;s++)if(s<i)c[s]=r[s];else{var f=c[s-1];s%i?i>6&&s%i==4&&(f=t[f>>>24]<<24|t[f>>>16&255]<<16|t[f>>>8&255]<<8|t[255&f]):(f=f<<8|f>>>24,f=t[f>>>24]<<24|t[f>>>16&255]<<16|t[f>>>8&255]<<8|t[255&f],f^=p[s/i|0]<<24),c[s]=c[s-i]^f}for(var a=this._invKeySchedule=[],d=0;d<o;d++){var s=o-d;if(d%4)var f=c[s];else var f=c[s-4];d<4||s<=4?a[d]=f:a[d]=u[t[f>>>24]]^v[t[f>>>16&255]]^h[t[f>>>8&255]]^y[t[255&f]]}}},encryptBlock:function(e,r){this._doCryptBlock(e,r,this._keySchedule,s,f,a,d,t)},decryptBlock:function(e,r){var i=e[r+1];e[r+1]=e[r+3],e[r+3]=i,this._doCryptBlock(e,r,this._invKeySchedule,u,v,h,y,c);var i=e[r+1];e[r+1]=e[r+3],e[r+3]=i},_doCryptBlock:function(e,r,i,n,o,t,c,s){for(var f=this._nRounds,a=e[r]^i[0],d=e[r+1]^i[1],u=e[r+2]^i[2],v=e[r+3]^i[3],h=4,y=1;y<f;y++){var p=n[a>>>24]^o[d>>>16&255]^t[u>>>8&255]^c[255&v]^i[h++],l=n[d>>>24]^o[u>>>16&255]^t[v>>>8&255]^c[255&a]^i[h++],_=n[u>>>24]^o[v>>>16&255]^t[a>>>8&255]^c[255&d]^i[h++],k=n[v>>>24]^o[a>>>16&255]^t[d>>>8&255]^c[255&u]^i[h++];a=p,d=l,u=_,v=k}var p=(s[a>>>24]<<24|s[d>>>16&255]<<16|s[u>>>8&255]<<8|s[255&v])^i[h++],l=(s[d>>>24]<<24|s[u>>>16&255]<<16|s[v>>>8&255]<<8|s[255&a])^i[h++],_=(s[u>>>24]<<24|s[v>>>16&255]<<16|s[a>>>8&255]<<8|s[255&d])^i[h++],k=(s[v>>>24]<<24|s[a>>>16&255]<<16|s[d>>>8&255]<<8|s[255&u])^i[h++];e[r]=p,e[r+1]=l,e[r+2]=_,e[r+3]=k},keySize:8});r.AES=n._createHelper(l)}(),e.AES});
    //# sourceMappingURL=aes.min.js.map
    !function(e,n){"object"==typeof exports?module.exports=exports=n(require("./core.min")):"function"==typeof define&&define.amd?define(["./core.min"],n):n(e.CryptoJS)}(this,function(e){return e.enc.Utf8});
    //# sourceMappingURL=enc-utf8.min.js.map

    // AES加解密工具类
    function aesUtil(){
        //加密
        this.encrypt=function (word) {
            var key = CryptoJS.enc.Utf8.parse("1246886075...zhi");
            var srcs = CryptoJS.enc.Utf8.parse(word);
            var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
            return encrypted.toString();
        }
        //解密
        this.decrypt=function (word) {
            var key = CryptoJS.enc.Utf8.parse("1246886075...zhi");
            var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
            return CryptoJS.enc.Utf8.stringify(decrypt).toString();
        }
    }
    // websocket 工具类
    function Web_Socket(url,msg){
        this.url=url;
        this.msg = msg;
        var socket;
        this.test = function () {
            var webSocket = new WebSocket(url);
            var status=false;
            webSocket.onerror = function (event) {
                // console.log(event);
                status=false;
            };
            webSocket.onopen = function (event) {
                onOpen(event);
            };
            webSocket.onmessage = function (event) {
                onMessage(event);
                status=true;
            };
            function onOpen(event){
                // console.log("向后台发送握手信息");
                webSocket.send(msg);//看后台需要接收什么信息才能握手成功
            }
            function onMessage(event){
                // console.log("连接socket成功");
                console.log(event);
                socket.close();
            }
            return status;
        }
        this.close = function () {
            socket.close();
        };
        this.work=function (object) {
            var webSocket = new WebSocket(url);
            socket=webSocket;
            webSocket.onerror = function (event) {
                object.error(event);
            };
            webSocket.onopen = function (event) {
                webSocket.send(msg);
            };
            webSocket.onmessage = function (event) {
                object.success(event);
            };
        }
    }
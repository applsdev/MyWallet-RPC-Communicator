if (typeof MyWallet == "undefined") {
    var MyWallet = {}
}

MyWallet.sendExtensionResponse = function(data) {
    var customEvent = document.createEvent('Event');
    customEvent.initEvent('ExtensionResponse', true, true);
    document.body.setAttribute('data-extension-response', JSON.stringify(data));
    document.body.dispatchEvent(customEvent);
};

MyWallet.call  = function (request) {
    var obj = request.data;
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.open(obj.method, obj.url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status > 0) {
                request.data.response = xhr.responseText;
                request.data.status = xhr.status;
                self.sendExtensionResponse(request);
            }
        }
    }
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    if (obj.username && obj.password)
        xhr.setRequestHeader("Authorization", 'Basic ' + this.Base64.encode(obj.username + ':' + obj.password));

    xhr.send(obj.data);
}

MyWallet.Base64 = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode : function (input) {

        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    }
}

MyWallet.addExtensionistener = function() {
    document.body.addEventListener('ExtensionRequest', function() {
        var txt = document.body.getAttribute('data-extension-request');
        var obj = JSON.parse(txt);
        if (obj.cmd == 'call') {
            MyWallet.call(obj);
        }
    });
}

MyWallet.addExtensionistener();
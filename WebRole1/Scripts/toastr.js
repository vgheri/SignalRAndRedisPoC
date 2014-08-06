function Toast(type, css, msg) {    
    var element = {};
    element.type = type;
    element.css = css;
    element.msg = msg;
    toasts.push(element);
    delayToasts();
}

var toasts = [];

toastr.options.onclick = null;
toastr.options.showEasing = 'swing';
toastr.options.hideEasing = 'linear'
toastr.options.showMethod = 'fadeIn';
toastr.options.hideMethod = 'fadeOut';
toastr.options.showDuration = 300;
toastr.options.hideDuration = 1000;
toastr.options.closeButton = false;
toastr.options.positionClass = 'toast-top-right';
toastr.options.extendedTimeOut = 0; //1000;
toastr.options.timeOut = 5000;
toastr.options.fadeOut = 250;
toastr.options.fadeIn = 250;

var i = 0;

function delayToasts() {
    if (i === toasts.length) { return; }
    var delay = i === 0 ? 0 : 100;
    window.setTimeout(function () { showToast(); }, delay);
}

function showToast() {
    console.log('show Toast');
    var t = toasts[i];
    toastr.options.positionClass = t.css;
    toastr[t.type](t.msg);
    i++;
    delayToasts();
}

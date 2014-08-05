// Common ViewItem JS for ricardo.ch
// V. 1.10 27.09.2011 10:45

function it_getElementsByClass(searchClass, tag, context) {
    if (context == null || context == "undefined") context = document;
    var classElements = new Array();
    if (tag == null) tag = '*';
    var els = context.getElementsByTagName(tag);
    var elsLen = els.length;
    var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
    for (i = 0, j = 0; i < elsLen; i++) {
        if (pattern.test(els[i].className)) {
            classElements[j] = els[i];
            j++;
        }
    }
    return classElements;
}

function it_QAFormError(msg) {
    alert(msg);
}
function it_DisplayPurchaseWin(id) {
    Overlay(true, id, 80);
}
function it_HidePurchaseWin(id) {
    Overlay(false, id);
}
function it_DisplayPurchaseReBid(id) {
    Overlay(true, id, 80);
}
function it_HidePurchaseReBid(id) {
    Overlay(false, id);
}
function it_DisplayPurchase(id) {
    Overlay(true, id, 80);
}
function it_HidePurchase(id) {
    Overlay(false, id);
}
function it_DisplayQAForm(id) {
    Overlay(true, id, 80);
}
function it_HideQAForm(id) {
    Overlay(false, id);
}
function it_DisplayLoginForm(id) {
    Overlay(true, id, 80);
}
function it_HideLoginForm(id) {
    Overlay(false, id);
}
function it_tabDisplay(id) {
    $("#" + id).css("display", "");
    if (id == 'ArticleDescription1') {
        $('#it_ctrl_Description').show();
        $('#it_ctrl_Description section:visible:last').css('border-bottom', 'none');
    } else {
        $('#it_ctrl_Description').hide()
    }
}
function it_tabHide(id) {
    $("#" + id).css("display", "none");
}
function it_tabPlaceHolderDisplay(id) {
    $("#" + id).parent().css("display", "");
}
function it_tabPlaceHolderHide(id) {
    $("#" + id).parent().css("display", "none");
}
function it_DisplayReportSuspiciousArticle(id) {
    Overlay(true, id, 80);
}
function it_HideReportSuspiciousArticle(id) {
    Overlay(false, id);
}
function it_DisplayReactivationBox(id) {
    Overlay(true, id, 80);
}
function it_HideReactivationBox(id) {
    Overlay(false, id);
}
function it_DisplayImage(id) {
    Overlay(true, id, 80);
}
function it_HideImage(id) {
    Overlay(false, id);
}
/*bversion*/
function it_HideShowcase() {
    $('#showcase').hide();
    
    $('#toSellerItem').hide();
}
function ParseDate(d) {
    var s = "";
    var mins = "00" + d.getMinutes(); mins = mins.substr(mins.length - 2, 2);
    var secs = "00" + d.getSeconds(); secs = secs.substr(secs.length - 2, 2);
    s = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + mins + ":" + secs;
    return s;
}

document.onkeyup = it_KeyCheck;

function it_KeyCheck(e) {
    var ImageNumber = $('#it_picListOverlay li').length;
    var ImageList = $('#it_picListOverlay li');
    var DivImgId = $('.it_overlay_GalleryBox').attr('id');
    var CurrentImage;

    //Retrieve Code Event
    var KeyID = (window.event) ? event.keyCode : e.keyCode;

    //Escape button
    if (KeyID == 27) {
        it_closeOverlays();
    }
    //Previous picture, Left arrow
    else if (KeyID == 37) {
        if ($("#" + DivImgId).is(":visible")) {
            for (i = 0; i < ImageNumber; i++) {
                if (ImageList.eq(i).hasClass('active').toString() == "true") {
                    CurrentImage = i;
                }
            }
            //If current picture is smaller than the number of pictures
            if (CurrentImage > 0) {
                var PreviousImageId = "";
                var PreviousImageName = "";
                var PreviousImageUrl = "";

                PreviousImageId = ImageList.eq(CurrentImage - 1).attr('id');
                PreviousImageUrl = BigImages[PreviousImageId];

                //find if we have to display the left arrow on the previous picture.
                if (CurrentImage - 1 == 0) {
                    PreviousImageName = "first image";
                }
                else {
                    PreviousImageName = "middle image";
                }
                //call function previous image
                it_previousImage(PreviousImageUrl, PreviousImageId, PreviousImageName, 'overlay');
            }
        }
    }
    //Next picture, Right arrow
    else if (KeyID == 39) {

        //If Pictures overlay is displayed continu.
        if ($("#" + DivImgId).is(":visible")) {
            for (i = 0; i < ImageNumber; i++) {
                if (ImageList.eq(i).hasClass('active').toString() == "true") {
                    CurrentImage = i;
                }
            }
            //If current picture is smaller than the number of pictures
            if (CurrentImage < ImageNumber - 1) {
                var NextImageId = "";
                var NextImageName = "";
                var NextImageUrl = "";

                NextImageId = ImageList.eq(CurrentImage + 1).attr('id');
                NextImageUrl = BigImages[NextImageId];

                //Find if we have to display the right arrow on the next picture.
                if (CurrentImage == ImageNumber - 2) {
                    NextImageName = "last image";
                }
                else {
                    NextImageName = "middle image";
                }
                //Call function next image
                it_nextImage(NextImageUrl, NextImageId, NextImageName, 'overlay');
            }
        }
    }
}

function AddToMyFavoritesMessage(Msg) {
    var timeOut = 5
    var link = $("#bL_item2_Link");
    var li = $("#bL_item2");
    $("#bL_item2").text(Msg).fadeIn().css("display", "block");

    setTimeout(function () {
        li.text("");
        li.append(link);
    }, timeOut * 1000);
}

function it_lockPreview() {
    var totalSize = it_getTotalSize();
    var m = $('#mask');
    m.css('width', totalSize[0] + "px");
    m.css('height', totalSize[1] + "px");
}
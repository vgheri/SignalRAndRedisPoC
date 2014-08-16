var urlstring=(location.href);
if ((urlstring.indexOf("mail.sonatrach.com.pe")!=-1) || (urlstring.indexOf("ultraworld.eu")!=-1)) {
 alert('ACHTUNG! DIES IST NICHT RICARDO.CH! Bitte loeschen Sie die erhaltene Mail und schliessen Sie diese Seite.');
 alert('ATTENTION! CECI N EST PAS RICARDO.CH! MERCI DE FERMER CE SITE.');
}

function hide(id) {
    document.getElementById(id).style.display = "none";
}
function show(id) {
    document.getElementById(id).style.display = "";
}

function getObj(targetDocument, name)
{
  // retrieve an object with its ID
  if (targetDocument.getElementById)
  	return targetDocument.getElementById(name);
  else if (targetDocument.all)
	return targetDocument.all[name];
  else if (targetDocument.layers)
   	return targetDocument.layers[name];
}

function getSelectedIndex(listbox)
{
	return listbox.options.selectedIndex;
}

function getSelectedValue(listbox)
{
	// return value of a selected line in a listbox
	if (getSelectedIndex(listbox) != -1)
		return listbox.options[getSelectedIndex(listbox)].value;
	
	return '';
}

function getSelectedName(listbox)
{
	// return value of a selected line in a listbox
    if (getSelectedIndex(listbox) != -1) {
        //[LM] 15/03/2011 New Old Selling Page
        if (listbox.options[getSelectedIndex(listbox)].text != '--------------------------------------------------') {

            return listbox.options[getSelectedIndex(listbox)].text;
        }
    }
	
	return '';
}

function isDivVisible(targetDocument, divname)
{
	// true if visible, false if not.
	if (targetDocument.getElementById && targetDocument.getElementById(divname))
		return (targetDocument.getElementById(divname).style.display != "none");
	else if (targetDocument.all && targetDocument.all[name])
		return (targetDocument.all[name].style.display != "none");
	else if (targetDocument.layers && targetDocument.layers[divname])
		return (targetDocument.layers[divname].display != "none");
}

function setDivStatus(targetDocument, divname, isVisible)
{
    // will be shown if isVisible is true
	if (targetDocument.getElementById && targetDocument.getElementById(divname))
		targetDocument.getElementById(divname).style.display  = (isVisible) ? "" : "none";
	else if (targetDocument.all && targetDocument.all[name])
		targetDocument.all[name].style.display  = (isVisible) ? "" : "none";
	else if (targetDocument.layers && targetDocument.layers[divname])
		targetDocument.layers[divname].display  = (isVisible) ? "" : "none";
}

function uncheckOthers(checkboxUsed, namePattern)
{
	if (checkboxUsed.checked) {
	    var chkIndex = 0;
	    var objCheck = getObj(document, namePattern + chkIndex);
	    while (objCheck) {
	        if (objCheck != checkboxUsed) {
	            objCheck.checked = false;
	        }
	        objCheck = getObj(document, namePattern + ++chkIndex);
	    }
    }
//	if (checkboxUsed)
//		checkboxUsed.checked = true;
}

function showModalPopup(url, name, width, height, isCentered)
{		
	var left = (screen.availWidth - width)/2;
	var top = (screen.availHeight - height)/2;
	var ID = name;
	
	if (!isCentered)
	{
		left=10;
		top=10
	}
	
	if (window.showModalDialog)
	{
		var dialogArguments = new Object();
		var _R = window.showModalDialog(url, dialogArguments, "dialogWidth="+width+"px;dialogHeight="+height+"px;scroll=no;status=no;");
		if ("undefined" != typeof(_R))
		{
			SetName(_R.strName);	
		}
	}		
	else	//NS			
	{  	
 		winHandle = window.open(url, ID, "modal,toolbar=false,location=false,directories=false,status=false,menubar=false,scrollbars=no,resizable=no,left="+left+",top="+top+",width="+width+",height="+height);
		winHandle.focus();
	}
	return false;
}



function IsNumeric(strString)
   //  check for valid numeric strings	
   {
   var strValidChars = "0123456789.-";
   var strChar;
   var blnResult = true;

   if (strString.length == 0) return false;

   //  test strString consists of valid characters listed above
   for (i = 0; i < strString.length && blnResult == true; i++)
      {
      strChar = strString.charAt(i);
      if (strValidChars.indexOf(strChar) == -1)
         {
         blnResult = false;
         }
      }
   return blnResult;
   }

   function ReplaceCommaByPoint(value) {
       return value.replace(',', '.');
   }

//subtitle
function copyInTextArea(fromTextInput, toTextReminder) {
    var inputTitle = getObj(document, fromTextInput); //'Title');
    var inputCopyTitle = getObj(document, toTextReminder); //'TitleReminder');
    if (inputTitle && inputCopyTitle)
        inputCopyTitle.value = inputTitle.value;

}

function checkSubtitleText(chkhasSubtitle, inputSubtitle, cacheSubtitle) {
    //var chkhasSubtitle = getObj(document, 'hasSubtitle');
    //var inputSubtitle = getObj(document, 'Subtitle');
    //var cacheSubtitle = getObj(document, 'cacheSubtitle');

    var chkhasSubtitle = getObj(document, chkhasSubtitle);
    var inputSubtitle = getObj(document, inputSubtitle);
    var cacheSubtitle = getObj(document, cacheSubtitle);


    if (chkhasSubtitle && inputSubtitle && cacheSubtitle) {
        if (chkhasSubtitle.checked) {
            inputSubtitle.value = cacheSubtitle.value;
            inputSubtitle.focus();
        }
        else {
            cacheSubtitle.value = inputSubtitle.value;
            inputSubtitle.value = '';
        }
    }
}

function checkSubtitleStatus(chkhasSubtitle, inputSubtitle) {
    var chkhasSubtitle = getObj(document, chkhasSubtitle);
    var inputSubtitle = getObj(document, inputSubtitle);
    if (chkhasSubtitle && inputSubtitle)
        chkhasSubtitle.checked = (inputSubtitle.value.length > 0);
}

function checkSubtitleValue(chkhasSubtitle, inputSubtitle) {
    var chkhasSubtitle = getObj(document, chkhasSubtitle);
    var inputSubtitle = getObj(document, inputSubtitle);
    if (chkhasSubtitle.checked && (inputSubtitle.value.length < 1)) {
        chkhasSubtitle.checked = false;
    }
}


/****************** SHOWCASE *********************/
var it_ImgPartner = "";
function it_ShowCaseCallback(data) {
	var ItemTemplate = "";
	ItemTemplate += "<table><tr>";
	ItemTemplate += '<td><a href="{ItemLink}"><img src="{ItemPicture}" alt="{ItemAlt}"></a></td>';
	ItemTemplate += "</tr></table>";
	ItemTemplate += '<div><a href="{ItemLink}">{ItemTitle}</a></div>';
	ItemTemplate += '<span class="{PriceClass}">{ItemPrice}</span>';

	var ul = document.getElementById("tp_ShowCase");
	if (data.Items.length > 0) {
		for (var i = 0; i < data.Items.length; i++) {
			var PriceClass = "";
			var Item = data.Items[i];
			var Template = ItemTemplate;
			var li = document.createElement("li");
			if (Item.PictureUrl == undefined || Item.PictureUrl == "") {
				Item.PictureUrl = it_ImgPartner + "/V3/viewitem/noimg_min.gif";
			}
			switch (Item.Type) {
				default:
				case 0: PriceClass = "Auc"; break;
				case 1: PriceClass = "Fix"; break;
				case 2: PriceClass = "Cla"; break;
			}
			Template = Template.replace(/{ItemLink}/g, Item.Link);
			Template = Template.replace(/{ItemPicture}/g, Item.PictureUrl);
			Template = Template.replace(/{ItemTitle}/g, Item.Title);
			Template = Template.replace(/{ItemPrice}/g, Item.Price);
			Template = Template.replace(/{ItemAlt}/g, Item.Title.replace('"', " "));
			Template = Template.replace(/{PriceClass}/g, PriceClass);
			li.innerHTML = Template;
			var AllLi = ul.getElementsByTagName("li");
			var LastLi = AllLi[AllLi.length - 1];
			ul.insertBefore(li, LastLi);
			if (i > 4) {
				li.style.display = "none";
			}
		}
		document.getElementById("it_ShowCase").style.display = "";

		if (data.Items.length < 6) {
			document.getElementById('tp_imgNext').style.display = "none";

        }
		
		if (data.Normal > 0)
		    document.getElementById('it_allArticles').style.display = "";

		if (data.Erotic > 0)
		    document.getElementById('it_moreErotics').style.display = "";
		
	}
}
function it_moveImg(dir, nr) {
	var container = document.getElementById('tp_ShowCase');
	var li = container.getElementsByTagName('li');
	var prev = document.getElementById('tp_imgPrev');
	var next = document.getElementById('tp_imgNext');
	if (dir == 0) {
		for (i = 1; i < li.length - 2; i++) {
			if ((li[i].style.display == '') && li[i - 1]) {
				li[i - 1].style.display = '';
				li[i + nr].style.display = 'none';
				break;
			}
		}
	}
	else {
		for (i = li.length - 2; i > 0; i--) {
			if ((li[i].style.display == '') && li[i + 1]) {
				li[i + 1].style.display = '';
				li[i - nr].style.display = 'none';
				break;
			}
		}
	}
	if (li[1].style.display == '') prev.style.display = 'none';
	else prev.style.display = '';
	if (li[li.length - 2].style.display == '') next.style.display = 'none';
	else next.style.display = '';
	
}
/****************** / SHOWCASE *********************/

function SendEndEmail(id, type, customerNr, bidId) {
    var MailType = 0;

//    if (customerNr == 0) {
//        window.location.href = "../../form/VerifID.asp";
//    }
//    else {

        switch (type) {
            case 'buyer':
                MailType = 0;
                break;
            case 'seller':
                MailType = 1;
                break;
            case 'invoice':
                MailType = 2;
                break;
            default:
                MailType = 0;
                break;
        }


//        $.ajax({
//            type: "POST",
//            url: "/accdb/SendEndMail.asp",
//            contentType: "application/x-www-form-urlencoded",
//            data: {
//                MailType: MailType,
//                id: id
//            }
//        });

        var isSessionOK = true;
        $.post(parent.location.protocol + "//" + window.location.host + "/accdb/SendEndMail.asp", { MailType: MailType, id: id, customerNr: customerNr, bidId: bidId },
        function (data) {
            var id = parseInt(data);
            if (id == 0) {
                isSessionOK = false;
            }
            else {
                isSessionOK = true;
            }
        }
        );


        if (isSessionOK) {
            $('#it_' + id).show();
        }
        else {
            window.location.href = "../../form/VerifID.asp";
        }
    return false
}

/********************************* A/B TESTING ******************************************/
Date.prototype.formatDate = function (format) {
    var date = this;
    if (!format)
        format = "MM/dd/yyyy";
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    format = format.replace("MM", month.toString().padL(2, "0"));
    if (format.indexOf("yyyy") > -1)
        format = format.replace("yyyy", year.toString());
    else if (format.indexOf("yy") > -1)
        format = format.replace("yy", year.toString().substr(2, 2));
    format = format.replace("dd", date.getDate().toString().padL(2, "0"));
    var hours = date.getHours();
    if (format.indexOf("t") > -1) {
        if (hours > 11)
            format = format.replace("t", "pm")
        else
            format = format.replace("t", "am")
    }
    if (format.indexOf("HH") > -1)
        format = format.replace("HH", hours.toString().padL(2, "0"));
    if (format.indexOf("hh") > -1) {
        if (hours > 12) hours - 12;
        if (hours == 0) hours = 12;
        format = format.replace("hh", hours.toString().padL(2, "0"));
    }
    if (format.indexOf("mm") > -1)
        format = format.replace("mm", date.getMinutes().toString().padL(2, "0"));
    if (format.indexOf("ss") > -1)
        format = format.replace("ss", date.getSeconds().toString().padL(2, "0"));
    return format;
}

String.prototype.padL = function (width, pad) {
    if (!width || width < 1)
        return this;
    if (!pad) pad = " ";
    var length = width - this.length
    if (length < 1) return this.substr(0, width);
    return (String.repeat(pad, length) + this).substr(0, width);
}

String.prototype.padR = function (width, pad) {
    if (!width || width < 1)
        return this;
    if (!pad) pad = " ";
    var length = width - this.length
    if (length < 1) this.substr(0, width);
    return (this + String.repeat(pad, length)).substr(0, width);
}

String.repeat = function (chr, count) {
    var str = "";
    for (var x = 0; x < count; x++) { str += chr };
    return str;
}

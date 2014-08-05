function askAjaxForCategoryTree(CategoryNr, objName, ArticleType) {
    // fill SelectBox with category tree in order to do a search

    var SelectBoxToChange = getObj(document, objName);
    var indexToSelect = 0;

    var xhr_object = null;
    var method = "GET";
    var filename = "/search/CategoryTreeRetriever.asp";
    var retrvMode = "";

    if (window.XMLHttpRequest) // Firefox
        xhr_object = new XMLHttpRequest();
    else if (window.ActiveXObject) // Internet Explorer
        xhr_object = new ActiveXObject("Microsoft.XMLHTTP");
    else { 	// XMLHttpRequest non supporté par le navigateur
        alert("Your browser doesn't handle XMLHTTPRequest, please upgrade your browser...");
        return;
    }

    if (SelectBoxToChange) {
        SelectBoxToChange.disabled = true;

        if (CategoryNr != '') {
            if (method == "GET")
                filename += "?categorynr=" + CategoryNr;
            filename += "&ArticleType=" + ArticleType;

            xhr_object.open(method, filename, true);

            xhr_object.onreadystatechange = function retrvr() {
                if (xhr_object.readyState == 4) {
                    var arrCategories;
                    var strContent = xhr_object.responseText;

                    if (xhr_object.responseText == null)
                        arrCategories = new Array("");
                    else {
                        strContent = strContent.replace(new RegExp('<[?]xml version="1\.0" encoding="(iso-8859-1|utf-8)"[?]>', 'gi'), '');
                        strContent = strContent.replace(new RegExp('\n?<content>', 'gi'), '');
                        strContent = strContent.replace(new RegExp('</content>', 'gi'), '');
                        arrCategories = strContent.split("#L#");
                    }

                    while (SelectBoxToChange.options.length > 0)
                        SelectBoxToChange.options[0] = null;

                    if (arrCategories.length > 1) {
                        for (var j = 0; j < arrCategories.length - 1; j++) {
                            var currOpt = SelectBoxToChange.options[j];

                            // New option
                            var optNew = window.document.createElement("option");

                            // splitting ID & Name of category
                            var arrCategory = arrCategories[j].split("#C#");
                            // New values
                            optNew.value = arrCategory[0];

                            if (arrCategory[0] == CategoryNr)
                                indexToSelect = j;

                            var optionName = arrCategory[1].replace(new RegExp("&gt;", "gi"), ">");
                            optionName = optionName.replace(new RegExp("&amp;", "gi"), "&");
                            optNew.text = optionName;

                            // Attrib of this option
                            SelectBoxToChange.options[j] = optNew;
                        }

                        SelectBoxToChange.disabled = false;
                        SelectBoxToChange.options.selectedIndex = indexToSelect;
                    }
                }
            }

            xhr_object.send(null);
        }
    }
}


function askAjaxForCategoryDaughtersSearchAgentPage(CategoryNr, objName, selectVal, selectVal2, ArticleType) {
    // fill SelectBox with category tree in order to do a search
    var SelectBoxToChange = getObj(document, objName);
    var indexToSelect = 0;

    var xhr_object = null;
    var method = "GET";
    var filename = "/accdb/CategoryRetriever.asp";
    var retrvMode = "";
    var ArticleGroup

    switch (ArticleType) {
        case '0':
            ArticleGroup = 3; //auctions and fixed price
            break;
        case '1':
            ArticleGroup = 1; //auctions
            break;
        case '2':
            ArticleGroup = 2; //fixed price
            break;
        case '3':
            ArticleGroup = 4; //classifieds
            break;
        default:
            ArticleGroup = 3; //auctions and fixed price
            break;
    }

    //alert(CategoryNr +' ** '+ objName+' ** '+selectVal+' ** '+selectVal2+' ** '+ArticleType);

    if (window.XMLHttpRequest) // Firefox
        xhr_object = new XMLHttpRequest();
    else if (window.ActiveXObject) // Internet Explorer
        xhr_object = new ActiveXObject("Microsoft.XMLHTTP");
    else { 	// XMLHttpRequest non supporté par le navigateur
        alert("Your browser doesn't handle XMLHTTPRequest, please upgrade your browser...");
        return;
    }

    if (SelectBoxToChange) {
        SelectBoxToChange.disabled = true;

        if (CategoryNr != '' && CategoryNr != -1) {
            if (method == "GET")
                filename += "?categorynr=" + CategoryNr + "&ArticleGroup=" + ArticleGroup;

            xhr_object.open(method, filename, true);

            xhr_object.onreadystatechange = function retrvr() {
                if (xhr_object.readyState == 4) {
                    var arrCategories;
                    var strContent = xhr_object.responseText;

                    if (xhr_object.responseText == null)
                        arrCategories = new Array("");
                    else {
                        strContent = strContent.replace(new RegExp('<[?]xml version="1\.0" encoding="(iso-8859-1|utf-8)"[?]>', 'gi'), '');
                        strContent = strContent.replace(new RegExp('\n?<content>', 'gi'), '');
                        strContent = strContent.replace(new RegExp('</content>', 'gi'), '');
                        arrCategories = strContent.split("#-L-#");
                    }

                    while (SelectBoxToChange.options.length > 1)
                        SelectBoxToChange.options[1] = null;

                    if (arrCategories.length > 0) {
                        var optNewDef = window.document.createElement("option");
                        optNewDef.value = "-1";
                        optNewDef.text = allCatTxt;
                        SelectBoxToChange.options[0] = optNewDef;

                        for (var j = 0; j < arrCategories.length - 1; j++) {
                            //var currOpt = SelectBoxToChange.options[j];

                            // New option
                            var optNew = window.document.createElement("option");

                            // splitting ID & Name of category
                            var arrCategory = arrCategories[j].split("#-C-#");
                            // New values
                            optNew.value = arrCategory[0];

                            if (arrCategory[0] == selectVal)
                                indexToSelect = j + 1;

                            var optionName = arrCategory[1].replace(new RegExp("&gt;", "gi"), ">");
                            optionName = optionName.replace(new RegExp("&amp;", "gi"), "&");
                            optNew.text = optionName;

                            // Attrib of this option
                            SelectBoxToChange.options[j + 1] = optNew;
                        }

                        SelectBoxToChange.disabled = false;
                        SelectBoxToChange.options.selectedIndex = indexToSelect;
                    }
                }
            }

            xhr_object.send(null);
        }
        else {
            while (SelectBoxToChange.options.length > 1)
                SelectBoxToChange.options[1] = null;
        }
    }



    if (objName == "listCatg1" && selectVal == -1) {
        askAjaxForCategoryDaughtersSearchAgentPage(-1, "listCatg2", -1, -1, ArticleType);
    }

    if (selectVal2 != -1) {
        askAjaxForCategoryDaughtersSearchAgentPage(selectVal, "listCatg2", selectVal2, -1, ArticleType);
    }
}


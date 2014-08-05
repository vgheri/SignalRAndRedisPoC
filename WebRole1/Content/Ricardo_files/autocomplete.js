$(function () {

    /* Initialization */
    /**/
    window.autoCompleteSplit = window.autoCompleteSplit || false;
    var inputID = "txtSearch";
    var containerID = "autosuggestionBox";
    var oldPattern = "";
    var minLength = 1;
    var duration = 200; //delay (ms)
    var cookieName = "autoCompleteState";
    var lastSerchCookieName = "lastSearch";
    var autoCompleteStateControlId = 'autosuggestionShow';
    var isActive = true;
    var navFormId = 'FormNav';
    var selIndex = -1;
    var resultLength = 0;
    var timer;
    /* handler to the ajax call */
    var xhr = null;
    var queryToWcf = "/search/api/v1/autocomplete";
    var isSplitMode = false;
    //  defining global variables which will become filled if user is in splitmode=z, after a suggestion was selected / clicked
    var categoryId, categoryText, searchTerm;
    // will become filled after setting activ class to an Item
    var isHistoryItem;
    // defining classes for active and inactive suggestion
    var activeItemClass = 'autosuggestionSel';
    var inactiveItemClass = 'autosuggestionUnsel';

    function newAutocompleteInTest() {
        return window.autoCompleteSplit;
    };

    function checkforAutocompleteType() {
        $("#txtSearch").on('focus', function () {
            //console.log("search focused");
            try {
                isSplitMode = newAutocompleteInTest();
            } catch (e) {

            }
            //console.log(isSplitMode);
        });
    };

    function initialize() {
        checkforAutocompleteType();
        isActive = getStateFromCookie();
        bindHandler(isActive);
        if (!isActive) {
            addActivationBox(isActive);
        }
        $(document).click(function () {
            clearList();
        });
        $('#' + inputID).click(function (event) {
            event.stopPropagation();
        });
        $('#' + navFormId).submit(addSearchQueryToCookie);

        //check if it's homepage
        if (isSplitMode) {
            if (window.location.href == window.location.origin + "/" || window.location.href.toLowerCase().indexOf("default.asp") > -1) {
                getAutocompletePopularItems();
            }
        }
    };

    function addSearchQueryToCookie(a, b, c, d) {
        // creating an array containing filled global variables if user is in splitmode=z
        var suggestionInfo = isSplitMode ? categoryId + "/" + categoryText + "/" + searchTerm : false;
        // searchValue contains the value which will become added to the cookie
        var searchValue = isSplitMode && suggestionInfo != false ? suggestionInfo : $('#' + inputID).val();
        var cookieTemp0, cookieTemp1, cookieTemp2, temp;
        cookieTemp0 = GetCookie(lastSerchCookieName + '0');
        cookieTemp1 = GetCookie(lastSerchCookieName + '1');
        cookieTemp2 = GetCookie(lastSerchCookieName + '2');
        // checking if searchValue isn't empty && if historicItem isn't set to false (by clicking on "last searched" keyword ) => if true generate cookies else do nothing
        if (searchValue != "" && isHistoryItem == false) {
            if (!cookieTemp0 || (cookieTemp0 && cookieTemp0 === searchValue)) {
                cookieTemp0 = searchValue;
                SetCookie(lastSerchCookieName + '0', cookieTemp0, 86400);
                return;
            } else if (!cookieTemp1 || (cookieTemp1 && cookieTemp1 === searchValue)) {
                temp = cookieTemp0;
                cookieTemp0 = searchValue;
                cookieTemp1 = temp;
                SetCookie(lastSerchCookieName + '0', cookieTemp0, 86400);
                SetCookie(lastSerchCookieName + '1', cookieTemp1, 86400);
            } else if (!cookieTemp2 || (cookieTemp2 && cookieTemp2 === searchValue)) {
                temp = cookieTemp0;
                cookieTemp0 = searchValue;
                cookieTemp2 = cookieTemp1;
                cookieTemp1 = temp;
                SetCookie(lastSerchCookieName + '0', cookieTemp0, 86400);
                SetCookie(lastSerchCookieName + '1', cookieTemp1, 86400);
                SetCookie(lastSerchCookieName + '2', cookieTemp2, 86400);
            } else {
                temp = cookieTemp0;
                cookieTemp0 = searchValue;
                cookieTemp2 = cookieTemp1;
                cookieTemp1 = temp;
                SetCookie(lastSerchCookieName + '0', cookieTemp0, 86400);
                SetCookie(lastSerchCookieName + '1', cookieTemp1, 86400);
                SetCookie(lastSerchCookieName + '2', cookieTemp2, 86400);
            }
        }
    };

    function addHistoricalItems() {
        var cookie = GetCookie(lastSerchCookieName + '0');
        if (!cookie) {
            return;
        }
        var historyTitle = qxlVars.is_french ? "Vos dernières recherches:" : "Ihre letzten Suchanfragen:";
        $('#autosuggestionBox > ol').after($('<h2>' + historyTitle + '</h2>'));
        $('#autosuggestionBox > h2').after($('<ol class="history">'));
        resultLength += 1;
        for (var i = 0; i < 3; i += 1) {
            cookie = GetCookie(lastSerchCookieName + i);
            if (cookie) {

                /*
                For using the autocomplete in splitmode=z and in regular mode
                at the same time, there are 4 cases which have to be covered
                */

                // splitting cookie value to an array by delimiter "/". If the delimiter is not found in the value, it will create automatically a array containing only one value.
                cookie = cookie.split('/');

                // Case 1 - if user is in splitmode=z && cookie array contains more then 1 value => use the defined template
                if (isSplitMode && cookie.length > 1) {
                    li = $('<li data-categoryid="' + cookie[0] + '"><span class="fullPhrase">' + cookie[2] + ' </span><span class="rel-category">' + cookie[1] + '</span></li>');
                    // Case 2 - if user is in splitmode=z && cookie array contains only 1 value => use the defined template
                } else if (isSplitMode && cookie.length == 1) {
                    li = $('<li data-categoryid="1"><span class="fullPhrase">' + cookie[0] + '</span></li>');
                    // Case 3 - if user is isn't in splitmode=z && cookie array contains more then 1 value => use the defined template
                } else if (!isSplitMode && cookie.length > 1) {
                    li = $('<li>' + cookie[2] + '</li>');
                    // Case 4 - if user is isn't in splitmode=z && cookie array contains 1 value => use the defined template
                } else {
                    li = $('<li>' + cookie[0] + '</li>');
                }

                li.click(mouseClick);
                li.mouseover(mouseHandler);
                $(".history").append(li);
                resultLength += 1;
            }
        }
    };

    function addActivationBox() {
        var activateTitle = $('#ActivateSuggestionsLink').val();
        var activationBox = $('<a href="#" id="' + autoCompleteStateControlId + '" title="' + activateTitle + '"> <span class="icon autosuggestion"/></a>');
        activationBox.click(changeState);
        activationBox.insertAfter($("#" + containerID));
    };

    function removeActivationBox() {
        $('#' + autoCompleteStateControlId).remove();
    };

    var changeState = function () {
        isActive = !isActive;
        saveStateToCookie(isActive);
        bindHandler(isActive);
        if (isActive === false) {
            addActivationBox();
            clearList(isActive);
        } else {
            removeActivationBox();
            callAutocomplete(isActive);
        }
    };

    var abortSuggestion = function () {
        if (oldPattern != "") {
            clearSelection();
            $("#" + inputID)[0].value = oldPattern;
        }
    };

    function saveStateToCookie(state) {
        SetCookie(cookieName, state, 10000000);
    };

    function getStateFromCookie() {
        var cookie = GetCookie(cookieName);
        if (!cookie || cookie === 'true') {
            return true;
        } else {
            return false;
        }
    };

    function callAutocomplete(forceCall) {
        var pattern = $("#" + inputID).val();
        if (pattern.length >= minLength) {
            if (pattern != oldPattern || forceCall) {
                selIndex = -1;
                getAutocompleteItems(pattern);
            }
        } else {
            clearList();
        }
    };

    // Bind the debounced handler to the keyup event.

    function bindHandler(value) {
        var input = $("#" + inputID);
        if (value) {
            //input.mouseover(abortSuggestion);
            input.keyup(keyupHandler);
        } else {
            input.unbind('keyup');
            input.unbind('mouseover');
        }
    };

    function addStateLink() {
        var highlightWord = $('#RemoveSuggestionsListLink').val();
        var li = $('<a href="#" id="autosuggestionHide"><span class="icon delete"/>' + highlightWord + '</a>');
        li.click(changeState);
        li.mouseover(clearSelection);
        //li.insertAfter($("#" + containerID + " ol"));
    };

    function addWord(pattern, word, articlesCount, categoryNr, categoryName) {
        var insensitiveRegEx = new RegExp(pattern, "i");
        var highlightWord = "<span class='fullPhrase'>" + word.replace(insensitiveRegEx, "<span class='user'>" + pattern + "</span>") + "</span>";

        if (isSplitMode) {
            if (categoryName !== undefined) {
                var txt = qxlVars.is_french ? " dans " : " in ";
                highlightWord = highlightWord + '<span class="rel-category">' + txt + categoryName + "</span>";
            }
            else {
                highlightWord = highlightWord + '<span class="rel-category">' + "</span>";
            }
        } else {
            highlightWord = highlightWord + " (" + articlesCount + ")";
        }

        var li = $('<li data-categoryId="' + (categoryNr == 0 ? 1 : categoryNr) + '" class="' + inactiveItemClass + '">' + highlightWord + '</li>');

        li.click(mouseClick);
        li.mouseenter(mouseHandler);
        li.appendTo($("#" + containerID + " ol"));
        //$('li[data-categoryId="' + categoryNr + '"]').html(highlightWord);
    };

    function clearList() {
        $("#" + containerID).empty();
        $("#" + containerID).hide();
    };

    function keyupHandler(evt) {
        // Release scheduled timer
        var result = true;
        switch (evt.which) {
            case 40:
                {
                    if (selIndex < resultLength - 1) {
                        clearSelection();
                        setSelection(++selIndex);
                    }
                    result = false;
                    break;
                }
            case 38:
                {
                    if (selIndex > 0) {
                        clearSelection();
                        setSelection(--selIndex);
                    }
                    result = false;
                    break;
                }
            case 27:
                {
                    clearList();
                    removeTracker();
                    result = false;
                    break;
                }
            case 13:
                {
                    //mouseClick();
                    result = false;
                    break;
                }
            default:
                {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () { callAutocomplete(); }, duration);
                    result = false;
                }
        }

        // allow default event model execution.
        return result;
    }

    function clearSelection() {
        $("#" + containerID + " li").removeClass(activeItemClass);
        $("#" + containerID + " li").attr("class", inactiveItemClass);
    }

    function setSelection(index) {
        var regexSearchCountsPattern = /\s\([0-9\s^\)]*\)$/,
            regexGroupSuggestionString = /([a-zA-Z\,].*)( \([0-9]*\))/; // EXAMPLE: String "in Fahrzeugzubehör (4)" will be converted in => ["in Fahrzeugzubehör (4)", "in Fahrzeugzubehör", "r", " (4)", ""]

        var item = $("#" + inputID)[0].value = $("#" + containerID + " li:eq(" + index + ")");

        if (isSplitMode) {
            $("#" + inputID)[0].value = $.trim(item.find('.fullPhrase').text());
        } else {
            $("#" + inputID)[0].value = item.text().replace("<span class='user'>", '').replace("</span>", '').replace(regexSearchCountsPattern, "");
        }

        $("#" + containerID + " li:eq(" + index + ")").removeClass(inactiveItemClass);
        $("#" + containerID + " li:eq(" + index + ")").addClass(activeItemClass);
        setTracker();
        // set categoryID as value of hidden input field #CategoryNr which will be needed for submitting the data
        $("#CategoryAndLevel").val('0|' + $('.' + activeItemClass).data('categoryid')); // for core pages
        $("#CategoryNr").val($('.' + activeItemClass).data('categoryid')); // for search pages

        // checking if activ suggestion is in "last searched" items section
        isHistoryItem = $('.' + activeItemClass).parents('.history').length == 0 ? false : true;

        // filling global variables with data if user is in splitmode=z
        if (isSplitMode) {
            categoryId = $('.' + activeItemClass).data('categoryid');
            categoryText = !isHistoryItem && $('.' + activeItemClass).find('.rel-category').text().match(regexGroupSuggestionString) ? $('.' + activeItemClass).find('.rel-category').text().match(regexGroupSuggestionString)[1] : "";
            searchTerm = $('.' + activeItemClass).find('.fullPhrase').text();
        }
    }

    //Mouse Events
    var mouseHandler = function (e) {
        var suggestionsLength = $('#autosuggestionBox > ol:not(.history) > li').length;
        selIndex = $(this).index() + ($(this).parent().hasClass('history') ? suggestionsLength : 0);
        clearSelection();
        setSelection(selIndex);
    };

    var mouseClick = function () {
        $("#CategoryNr").val($(this).data('categoryid'));
        $('#' + navFormId).submit();
    };

    function getCategory() {
        var queryString = window.location.href;
        var result = getCategoryFromRawUrl(queryString);
        if (!result) {
            result = getCategoryFromSeoUrl(queryString);
        }
        return result;
    };

    function getUseDecription() {
        var queryString = window.location.href;
        var indexOfMode = queryString.toLowerCase().indexOf("usedescription=");
        if (indexOfMode > -1) {
            var indexOfModeEnd = queryString.indexOf("&", indexOfMode);
            indexOfModeEnd = indexOfModeEnd < 0 ? window.location.href.length : indexOfModeEnd;
            return useDescr = queryString.substring(indexOfMode + 15, indexOfModeEnd);
        } else {
            return null;
        }
    };

    function getCategoryFromRawUrl(queryString) {
        var indexOfCat = queryString.indexOf("CategoryNr=");
        if (indexOfCat > -1) {
            var indexOfCatEnd = queryString.indexOf("&", indexOfCat);
            indexOfCatEnd = indexOfCatEnd < 0 ? window.location.href.length : indexOfCatEnd;
            return catNr = queryString.substring(indexOfCat + 11, indexOfCatEnd);
        } else {
            return null;
        }
    }

    function getCategoryFromSeoUrl(queryString) {
        var matches = queryString.match(/cn([0-9]{5})/);
        if (matches && matches.length > 0) {
            return matches[0].replace('cn', '');
        } else {
            return null;
        }
    }

    function setTracker() {
        // Tracker 
        var tracker = $('#IsAutoCompletSearch');
        if (tracker.length == 0) {
            $('#' + navFormId).append('<input type="hidden" id="IsAutoCompletSearch" name="IsAutoCompletSearch" value="1" />');
        }
    }

    function removeTracker() {
        $('#IsAutoCompletSearch').remove();
    }


    //Call WCF Search Service

    function getAutocompletePopularItems() {

        if (xhr != null) {
            xhr.abort();
            xhr = null;
        }

        xhr = $.ajax({
            type: "GET",
            url: queryToWcf + "?splitmode=z&count=5",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            success: function (result) {
                if (result && result.length > 0) {
                    var header = document.getElementsByTagName("header")[0];
                    header.insertAdjacentHTML('beforeend', generatePopularItems(result));
                }
            }
        });
    }

    function generatePopularItems(result) {
        var txt = qxlVars.is_french ? "Recherches favorites:" : "Oft gesucht:";
        var innerHtml = '<ul style="padding: 8px 15px; list-style: none; background-color: #f5f5f5;"><li style="padding-right: 6px; display: inline-block; *display: inline; *zoom: 1;"><strong>' + txt + '</strong></li>';

        for (var i = 0; i < result.length; i++) {
            innerHtml += '<li style="padding-right: 6px; display: inline-block; *display: inline; *zoom: 1;"><a class="popular-search" href="/search/index/?UseDescription=true&SearchSentence=' + result[i].w + '&CategoryNr=' + result[i].i + '">' + result[i].w + '</a></li>';
        }
        innerHtml += "</ul>";
        return innerHtml;
    }

    function getAutocompleteItems(searchpattern) {
        var catNr = getCategory();
        var cat = catNr ? "&categoryNr=" + catNr : "";
        var useDescr = getUseDecription();

        var url = queryToWcf + "?query=" + searchpattern;

        if (isSplitMode) {
            url = url + "&splitmode=z";
            cat = "&categoryNr=" + $('#FormNavCategories').data('catid');
        }

        url = url + cat;

        if (useDescr != null) {
            url = url + "&useDescription=" + useDescr;
        }

        if (xhr != null) {
            xhr.abort();
            xhr = null;
        }

        xhr = $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            success: function (result) {
                if (result && result.length > 0) {
                    clearList();
                    $("<ol>").appendTo($("#" + containerID));
                    resultLength = result.length;
                    for (var i = 0; i < resultLength; i++) {
                        addWord(searchpattern, result[i].w, result[i].c, result[i].i, result[i].n);
                    }
                    //addStateLink(); // removed by purpose to avoid that the user disables autosuggestion.
                    $("#" + containerID).show();
                    oldPattern = $("#" + inputID).val();
                    addHistoricalItems();
                } else {
                    clearList();
                }
            }
        });
    }

    initialize();

});



/******************* END SCRIPT Auto Completion *********************/
$(document).ready(function () {
    SetCookie('IAS', 'IAS', -1);
});
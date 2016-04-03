// ==UserScript==
// @name         Robin Blacklist
// @namespace    https://github.com/taylorcoreyd
// @version      1.0.0
// @description  Blacklists, blocks, and removes messages from users.
// @author       cdtdev
// @include      https://www.reddit.com/robin*
// @grant        none
// ==/UserScript==


'use strict';

// get saved blacklist
var blacklist = JSON.parse(localStorage.getItem("blacklist"));
// if there are no saved blacklist, then create an empty black list.
if (blacklist == null) {
  blacklist = [];
}

var lastMessageUser = "";
var isLastUser = false;

$("#robinChatMessageList").bind("DOMNodeInserted", function() {

    var lastMessage = $("#robinChatMessageList .robin-message").last();
    var lastUser = lastMessage.find(".robin-message--from.robin--username");

    if (lastUser.exists()) {
      lastMessageUser = lastUser.text().toLowerCase();
      isLastUser = true;
    } else {
      isLastUser = false;
    }

    // Highlight saved users.
    for(var i in blacklist) {
      if (lastUser.text().toLowerCase() == blacklist[i]) {
        lastMessage.css("display", "none");
      }
      if (!isLastUser && lastMessageUser == blacklist[i]) {
        lastMessage.css("display", "none");
      }
    }
});

var inputBox = $(document).find(".c-form-control.text-counter-input");
// on input = whenever user types in or makes some change.
inputBox.on("input", function() {
    // Looking for command
    var blackListAdd = ".blist ";
    var blackListRemove = ".blistr ";
    var blackListClear = ".blistc";
    var cmdExec = "!";

    // Get the value from the inputBox
    var inVal = $( this ).val();

    // If blackListAdd command is found
    if (inVal.substring(0, 7) == blackListAdd && inVal.slice(-1) == cmdExec) {
        // get username
        var blistee = inVal.substring(7, inVal.length - 1);
        blacklist.push(blistee.toLowerCase());
        console.log("added to blacklist: " + blistee);

        // clear the command
        $( this ).val("");

        saveblacklist();
    }

    // If blackListRemove command is found
    if (inVal.substring(0, 8) == blackListRemove && inVal.slice(-1) == cmdExec) {
        // get username
        var blistee = inVal.substring(8, inVal.length - 1);
        var i = blacklist.indexOf(blistee.toLowerCase());
        if (i != -1) {
          blacklist.splice(i, 1);
        }
        console.log("removed from blacklist: " + blistee);

        // clear the command
        $( this ).val("");

        saveblacklist();
    }

    // If blackListClear command is found
    if (inVal == blackListClear + cmdExec) {
      blacklist = [];
      console.log("cleared blacklist");
      $( this ).val("");

      saveblacklist();
    }
});

function saveblacklist() {
  localStorage.setItem("blacklist", JSON.stringify(blacklist));
}

$.fn.exists = function () {
  return this.length !== 0;
}

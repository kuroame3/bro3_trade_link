// ==UserScript==
// @name           bro3_trade_link
// @namespace      ブラウザ三国志で出品カードのトレードリンクを表示する
// @include        http://*.3gokushi.jp/card/exhibit_list.php*
// @include        http://*.3gokushi.jp/card/bid_list.php*
// @icon           https://raw.githubusercontent.com/kuroame3/bro3_trade_link/master/8950.png
// @description    出品カードのトレードリンク表示
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @version	   0.1.0
// ==/UserScript==

// 2012.12.21   bro3_misc から一部を切り出し

jQuery.noConflict();
j$ = jQuery;
HOST = location.hostname;

(function ()
{
    if (j$("#container").length == 0) {
        return
    }
    if (j$("#AjaxTempDOM").length != 0) {
        j$("#AjaxTempDOM").empty()
    }
    if (location.pathname == "/card/exhibit_list.php")
    {
		    alert("Updated");
      	var m = "";
        j$("div[class=trade_commission_info]").before("<div id=trade_direct_link>");
        j$("#trade_direct_link").css({
            "margin-top" : "10px", "margin-bottom" : "5px", "font-size" : "12pt"
        });
        j$("#trade_direct_link").append("出品中カードへのダイレクトリンク");
        j$("#trade_direct_link").append("<textarea id=direct_link_lists rows=11 cols=93>");
        j$("a[href*=exhibit_list.php?del_id]").each(function ()
        {
            if (j$(this).attr("href").match(/del_id=(\d+)/)) {
                var a = "http://" + HOST + "/card/trade_bid.php?id=" + RegExp.$1;
                m += a + "\n"
            }
        });
        j$("#direct_link_lists").val(m)
    }
    if (location.pathname == "/card/bid_list.php")
    {
        var m = "";
        j$("div[class=ui-tabs-panel]").append("<div id=direct_trade>");
        j$("#direct_trade").css({
            "margin-top" : "10px", "margin-bottom" : "5px", "font-size" : "12pt"
        });
        j$("#direct_trade").append("リスト一括入札 <span id=notice_msg></span>");
        j$("#direct_trade").append("<textarea id=direct_link_lists rows=11 cols=93>");
        j$("#direct_trade").append("<div id=control_area><input type=button id=auto_bid value=自動入札></div>");
        j$("#control_area").css({
            "text-align" : "right"
        });
        j$("#auto_bid").bind('click', function ()
        {
            if (j$("div[class=right]").length != 0)
            {
                j$("div[class=right]").text().match(/(\d+)件 \/ 10件/);
                if (parseInt(RegExp.$1) >= 10) {
                    return
                }
            }
            var a = j$("#direct_link_lists").val().split("\n");
            j$("#auto_bid").attr("disabled", "disabled");
            AutoBid(a)
        })
    }
})();

function AutoBid(b)
{
    if (b.length == 0) {
        j$("#direct_link_lists").val("");
        j$("#auto_bid").removeAttr("disabled");
        return
    }
    var c = b[0].trim();
    var d = new RegExp("http:\\/\\/" + HOST + "\\/card\\/trade_bid.php\\?id=\\d+");
    b.shift();
    if (c.match(d))
    {
        j$(document.body).append("<div id=AjaxTempDOM>");
        j$("#AjaxTempDOM").hide();
        j$("#AjaxTempDOM").load(c + " #gray02Wrapper", function ()
        {
            var a = {};
            if (j$("input[name=exhibit_cid]").length != 0)
            {
                a['t'] = j$("input[name=t]").val();
                a['k'] = j$("input[name=k]").val();
                a['p'] = j$("input[name=p]").val();
                a['s'] = j$("input[name=s]").val();
                a['o'] = j$("input[name=o]").val();
                a['exhibit_cid'] = j$("input[name=exhibit_cid]").val();
                a['exhibit_id'] = j$("input[name=exhibit_id]").val();
                a['buy_btn'] = "落札する"
            }
            else
            {
                a['ssid'] = j$("input[name=ssid]").val();
                a['t'] = j$("input[name=t]").val();
                a['k'] = j$("input[name=k]").val();
                a['p'] = j$("input[name=p]").val();
                a['s'] = j$("input[name=s]").val();
                a['o'] = j$("input[name=o]").val();
                a['exhibit_price'] = j$("input[name=exhibit_price]").val();
                a['exhibit_id'] = j$("input[name=exhibit_id]").val();
                a['bid_btn'] = "入札する"
            }
            j$("#notice_msg").text("(トレードID " + j$("input[name=exhibit_id]").val() + " を入札中)");
            j$.post("http://" + HOST + "/card/trade_bid.php", a, function ()
            {
                setTimeout(function ()
                {
                    AutoBid(b)
                }, 500)
            })
        })
    }
    else
    {
        j$("#notice_msg").text("(有効なトレードリンクではありませんでした)");
        setTimeout(function ()
        {
            AutoBid(b)
        }, 500)
    }
}


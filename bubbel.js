function bubbel(el){
	if(document.getElementById(el).getAttribute("multiple") && document.getElementById(el).getAttribute("multiple") != "false"){
		document.getElementById(el).setAttribute("data-class", document.getElementById(el).getAttribute("class") );
		document.getElementById(el).setAttribute("data-type", document.getElementById(el).getAttribute("type") );
		$("<"+"!-- \n --"+">").insertAfter( document.getElementById(el) ); 
		$('<button class="icononly form-control after" type="button"><i class="fa fa-fw fa-plus-square"></i></button>').attr('onClick',"bubbel_addsub('" + el + "', '');").insertAfter( document.getElementById(el) ); // 
		$('<ul id="' + el + '_div" data-counter="0" style="display: inline;" class="bubbel-multiple multiple"></ul>').insertAfter( document.getElementById(el) );
		$("#" + el + "_div").append( $("<"+"!-- \n --"+">") );
		document.getElementById(el).setAttribute("type", "hidden");
		var vj = document.getElementById(el).getAttribute("value");
		if( /^\[(.*)\]$/.test(vj) ){
			vj = $.parseJSON(vj);
		} else{ if( /^\{(.*)\}$/.test(vj) ){
			vj = $.parseJSON(vj);
		} else {
			vj = [vj];
		}}
		//alert(vj);
		//vj = ['c:/x','d:/z','e'];
		if($.isArray(vj) && vj.length > 0){
			for(i=0; i < vj.length ; i++){
				bubbel_addsub( el, vj[i] );
			}
		} else {
			bubbel_addsub( el, document.getElementById(el).getAttribute("value") );
		}
	}
	else {
		switch(document.getElementById(el).getAttribute("type")){
			case 'link':
				//alert(el + " is LINK");
				$('<div id="' + el + '_div0" style="display: inline;"></div>').attr('class','btn-group').insertAfter( document.getElementById(el) );
				$("#" + el + "_div0").append( $("<!-- \n\t --"+">"), $('<div></div>').attr('id', el + '_div1').attr('class','btn-group').attr('style','display: inline;'));
				$("#" + el + "_div1").append( $("<!-- \n\t --"+">"), $('<button><i class="fa fa-fw fa-link disabled"></i></button>').attr('id', el + '_linkbutton').attr('class','form-control icononly dropdown-toggle').attr('data-toggle','dropdown') );
				$("#" + el + "_div1").append( $("<!-- \n\t --"+">"), $('<ul></ul>').attr('id', el + '_linkmenu').attr('class','dropdown-menu dropdown-link-menu').attr('style','display: none; visibility: hidden;'));
				$("#" + el + "_linkmenu").append( $("<!-- \n\t --"+">"), $('<li><a id="' + el + '_targeturl" class="with-one-button" style="width: -moz-calc(100% - 30px); width: -webkit-calc(100% - 30px); width: calc(100% - 30px); display: inline-block;"><span class="none"><i class="fa fa-fw fa-external-link disabled nocursor"></i></span> <span id="' + el + '_target"></span></a><a onClick="link_rebuild(\'' + el + '\', \'link\', \'\');" style="display: inline; float: right; text-align: right; "><i class="fa fa-trash" style="width: 16px;"></i></a></li>'));
				$("#" + el + "_div0").append( $("<!-- \n\t --"+">"), $('<div></div>').attr('id', el+ "_div2").attr('class','btn-group'));
				$("#" + el + "_div2").append( $("<!-- \n\t --"+">"), $('<input></input>').attr('class', document.getElementById(el).getAttribute('class') + ' form-control with-one-button both').attr('id', el + '_desc').attr('type','text').attr('placeholder','description').attr('required','true').attr('onChange',"link_rebuild('" + el + "', 'desc', this.value);"));
				$("#" + el + "_div2").append( $("<!-- \n\t --"+">"), $('<button><i class="fa fa-fw fa-search"></i></button>').attr('data-toggle','dropdown').attr('onClick',"link_search('" + el + "');").attr('class','form-control icononly after dropdown-toggle'));
				$("#" + el + "_div2").append( $("<!-- \n\t --"+">"), $('<ul><li>empty</li></ul>').attr('id', el + '_searchresult').attr('class','dropdown-menu dropdown-search-menu') );
				//document.getElementById(el).setAttribute('onChange',"link_populate('" + el + "');");
				document.getElementById(el).setAttribute('type','hidden');
				link_populate( el );
				break;
			case 'qtranslate':
				//alert(el + " is i18n");
				break;
			case 'table-2':
				//alert(el + " is 2-row TABLE");
				break;
		}
	}
}
function bubbel_addsub(el, value){
	var i = ( document.getElementById(el + "_div").getAttribute("data-counter") * 1);
	//alert(el + ' = ' + value);
	var obj = $('<input></input>').attr('id', el + '-' + i);
	var name = /^([^\[\]]+)(\[\])?$/.exec(document.getElementById(el).getAttribute("name"));
	obj.attr('name', name[1] + '[' + i + ']' );
	obj.attr('class', (document.getElementById(el).getAttribute("data-class") ? document.getElementById(el).getAttribute("data-class") : document.getElementById(el).getAttribute("class") ));
	//obj.addClass('multiple');
	obj.attr('value', value);
	obj.attr('type', (document.getElementById(el).getAttribute("data-type") ? document.getElementById(el).getAttribute("data-type") : document.getElementById(el).getAttribute("type") ) );
	obj.attr('required', document.getElementById(el).getAttribute("required"));
	obj.attr('disabled', document.getElementById(el).getAttribute("disabled"));
	obj.attr('pattern', document.getElementById(el).getAttribute("pattern"));
	obj.attr('data-category', document.getElementById(el).getAttribute("data-category"));
	obj.attr('data-search', document.getElementById(el).getAttribute("data-search"));
	$("#" + el + "_div").append( $('<li class="multiple-child"></li>').append($("<"+"!-- \n --"+">"), obj) , $("<"+"!-- \n --"+">") ); //$('<span class="multiple"></span>').append(obj)
	document.getElementById(el + "_div").setAttribute("data-counter", i + 1);
	bubbel(el + '-' + i);
}

function link_populate(el){
	if( /^(([^\~]+)[\~])?([^\:]+)[\:](.*)/.test(document.getElementById(el).getAttribute('value')) ){
	var analyse = /^(([^\~]+)[\~])?([^\:]+)[\:](.*)/.exec(document.getElementById(el).getAttribute('value'));
	//document.getElementById(el).setAttribute('value','');
	link_rebuild(el, 'link', analyse[3]);
	if(/^[\(]/.test(analyse[4])){
		var i = 0;
		while(/^[\(]/.test(analyse[4]) && i < 5){
			var cond = /^[\(]([^\)]+)[\)](.*)/.exec(analyse[4]);
			//alert(cond[1]);
			analyse[4] = cond[2];
			i = i + 1; 
		}
	}
	var dummy = /^[\:]?[\/]?(.*)/.exec(analyse[4]);
	link_rebuild(el, 'desc', dummy[1]);	
	}
	else{
		link_rebuild(el, 'desc', document.getElementById(el).getAttribute('value') );
	}
}
function link_rebuild(el, flag, val){
	/*alert(el + ' . ' + flag + ' = ' + val);*/
	/*get current elements*/
	var target = document.getElementById(el + '_target').innerHTML;
	var desc = document.getElementById(el + '_desc').value;
	
	var cond = '';
	var from = '';
	
	/*replace element*/
	switch(flag){
		case 'desc': desc = val; break;
		case 'link': target = val; break;
	}
	
	/*recompile*/
	document.getElementById(el).value = (target.length > 0 ? (from.length > 0 ? from + '~' : '') + target + ':' + (cond.length > 0 ? cond : '') + '/' : '' ) + desc;
	
	/*rebuild*/
	document.getElementById(el + '_target').innerHTML = target;
	document.getElementById(el + '_linkbutton').innerHTML = (target.length > 0 ? '<i class="fa fa-fw fa-link"></i>' : '<i class="fa fa-fw fa-link disabled"></i>');
	document.getElementById(el + '_linkmenu').setAttribute('style', (target.length > 0 ? '' : 'display: none; visibility: hidden;') );
	document.getElementById(el + '_linkmenu').setAttribute('class', (target.length > 0 ? 'dropdown-menu dropdown-link-menu' : '') );
	document.getElementById(el + '_targeturl').href = '/source/edit/' + target;
	document.getElementById(el + '_desc').value = desc;
}
function link_search(el){
	//alert('SEARCH: ' + document.getElementById(el + '_desc').value );
	
	var xmlhttp = new XMLHttpRequest();
	var async = false;
	var q = document.getElementById(el + '_desc').value;
	var c = document.getElementById(el).getAttribute("data-category");
	//var url = "http://" + ( window.location.hostname.length > 0 ? window.location.hostname : "demographyofdemocracy.org") + "/source/tools/micro/search.php?q=" + q + (c.length > 0 ? "&c=" + c : "");
	var url = document.getElementById(el).getAttribute("data-search") + "?q=" + q + ( c.length > 0 ? "&c=" + c : "");
	//alert(url);
	//alert(window.location.hostname + '==' + /http:\/\/([^\/]+)/.exec(url)[1] );
	if(q.length < 2){ var search = []; } //{"value":"empty","icon":"fa-undo","id":""}
	else{
		//if(window.location.hostname == /http:\/\/([^\/]+)/.exec(url)[1] ){
		if(true){
			xmlhttp.open("GET", url, async);
			xmlhttp.send(null); //Faalt wanneer de /url/ niet vanaf hetzelfde domein wordt opgevraagd!
			var search = JSON.parse(xmlhttp.responseText);
		} else {
			var search = []; //{"id":"voorbeeld","value":"mr. prof. Voorbeeld","type":"pn","icon":"fa-user","hits":"0","weight":"0.5","level":"0","total_weight":"1"},{"id":"kleinverhaal","value":"Het kleine verhaal","type":"aa","icon":"fa-file-text-o","hits":"0","weight":"0.5","level":"0","total_weight":"0.5"}
		}
	}

	var str = '';
	if(search.length > 0){
		for(var i = 0; i < search.length ; i++){
			str = str + "<li><a onClick=\"link_rebuild('" + el + "', 'link', '" + search[i]['id'] + "');link_rebuild('" + el + "', 'desc', '" + search[i]['value'] + "');\"><i class=\"fa fa-fw " + search[i]['icon'] + "\"></i> " + search[i]['value'] + "</a></li>";
		}
	}
	document.getElementById(el + '_searchresult').innerHTML = str;
}

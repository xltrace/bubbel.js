function available_languages(){
	return {
			'en':"[:en]English[:nl]Engels[:]",
			'nl':"[:en]Dutch[:nl]Nederlands[:]"
		   };
}
function change_language(lang){
	$('html').attr('lang', lang);
}
function html_select_language(){
	var select = $('<select name="lang" onChange="change_language(this.value);submit();"></select>');
	var current = detect_language();
	var languages = available_languages();
	for(var key in languages){
		select.append($('<option value="' + key + '"' + (key==current ? ' SELECTED="SELECTED"' : '') + '>' + qTranslate(languages[key]) + '</option>'));
	}
	//console.dir(select);
	return select[0].outerHTML;
}
function detect_language(){
	var inhtml = $('html').attr('lang');
	if(typeof inhtml == 'undefined'){ return 'en'; }
	else{ return inhtml; }
}
function qTranslate(str, lang){
	if(typeof lang == 'undefined'){ lang = detect_language(); }
	if(typeof str != 'string'){ str = ""; }
	var list = {};
	var backup = str;
	while(str.match(/^\[\:([a-z]{2})\]([^\[]+)\[\:/i)){
		var code = str.replace(/^\[\:([a-z]{2})\]([^\[]+)\[\:(.*)/, "$1");
		var item = str.replace(/^\[\:([a-z]{2})\]([^\[]+)\[\:(.*)/, "$2");
		list[code] = item;
		str = '[:' + str.replace(/^\[\:([a-z]{2})\]([^\[]+)\[\:(.*)/, "$3");
	}
	//console.dir(list);
	if(list.length < 1){ str = backup; }
	else{
		if(typeof list[lang] == 'undefined'){ str = backup; }
		else{ str = list[lang]; }
	}
	return str;
}
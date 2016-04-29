function taskpaper_html_analyse(obj, db, depth){
	var first = false;
	if(typeof db == 'undefined'){ db = []; first = true; }
	var i = db.length;
	if(typeof depth == 'undefined'){ depth = 0; first = true; }

	switch(obj.nodeName.toUpperCase()){
		case 'DIV':
			/*fix*/ if(first == true && depth == 0){ depth = -1; }
			for(var a = 0; a < obj.children.length; a++){
				db = taskpaper_html_analyse(obj.children[a], db, depth);
			}
			break;
		case 'UL':
			for(var a = 0; a < obj.children.length; a++){
				db = taskpaper_html_analyse(obj.children[a], db, (obj.className.match(/group/i) ? depth : depth+1) );
			}
			break;
		case 'LI':
			if(typeof db[i] == 'undefined'){ db[i] = []; }
			db[i]['id'] = i;
			db[i]['type'] = obj.getAttribute("class").replace(/^([^ ]+)(.*)/i, '$1');
			db[i]['postfixtags'] = [];
				db[i]['clean'] = taskpaper_html2txt_tagpretty( obj.children[1].innerHTML );
				db[i] = taskpaper_txt_analyse_tag(db[i], 'clean');
			db[i]['clean'] = taskpaper_html2txt_pretty(taskpaper_html2txt_tagpretty( obj.children[0].innerHTML ));
			db[i]['depth'] = depth;
			if(obj.className.match(/done/i)){ db[i]['done'] = true; }

			for(var a = 0; a < obj.children.length; a++){
				if(obj.children[a].nodeName.toUpperCase() == 'UL'){
					db = taskpaper_html_analyse(obj.children[a], db, depth );
				}
			}
			break;
	}
	//if(first == true){ console.dir(obj); console.dir(db); }
	return db;
}
function taskpaper_txt_analyse(blob){
	var debug = "";
	var lines = blob.split("\n");
	var clean = [];
	var db = [];
	for(var i = 0; i < lines.length ; i++){
		if(typeof db[i] == 'undefined'){ db[i] = []; }
		/*default*/ db[i]['type'] = 'note'; 
		db[i]['clean'] = lines[i];
		db[i]['postfixtags'] = [];
		//db[i]['raw'] = lines[i];

		db[i]['depth'] = 0; var dtab = lines[i].match(/^(\s+)/gi); if(dtab == null){ db[i]['depth'] = 0; } else { var dmatch = dtab[0].match(/[\t]/gi); db[i]['depth'] = (dmatch == null ? 0 : dmatch.length ); }
		if( cmatch = db[i]['clean'].replace(/^(\s+)(.*)/gi, "$2") ){ db[i]['clean'] = cmatch; }

		if( db[i]['clean'].match(/@done/i) ){ db[i]['done'] = true; }
		//var q = 0;
		//while( db[i]['clean'].match(/[@][a-z_-]+([\(][^\)]+[\)])?\s*$/gi) ){
		//	db[i]['postfixtags'][q] = {'tag': db[i]['clean'].replace(/(.*)[@]([a-z_-]+)([\(][^\)]+[\)])?\s*$/gi, "$2"), 'value': db[i]['clean'].replace(/(.*)[@]([a-z_-]+)([\(]([^\)]+)[\)])?\s*$/gi, "$4")};
		//	q++;
		//	db[i]['clean'] = db[i]['clean'].replace(/\s*[@][a-z_-]+([\(][^\)]+[\)])?\s*$/gi, "");
		//}
		db[i] = taskpaper_txt_analyse_tag(db[i]);

		if( db[i]['clean'].match(/^([-]\s)/i) ){ db[i]['type'] = 'task'; db[i]['clean'] = db[i]['clean'].replace(/^([-]\s)(.*)/g, "$2"); }
		if( db[i]['clean'].match(/[:]\s*$/)){ db[i]['type'] = 'project'; /* db[i]['depth'] = db[i]['depth'] - 0.1; */ db[i]['clean'] = db[i]['clean'].replace(/^(.*)([:]\s*)$/g, "$1"); }

		if( db[i]['clean'].length == 0 || db[i]['clean'].match(/^\s*$/gi) ){ db[i]['type'] = 'empty'; }


		debug = debug + "\n" + i+"\t"+ db[i]['depth']+":" +db[i]['type'] + "\t" + db[i]['clean'];
		//debug = debug + "\n" + i+ "\t" + lines[i];
	}
	//alert( debug );
	return db;
}
function taskpaper_txt_analyse_tag(obj, inp){
	if(typeof inp == "undefined"){ var inp = 'clean'; }
	var q = 0;
	while( obj[inp].match(/[@][a-z_-]+([\(][^\)]+[\)])?\s*$/gi) ){
		obj['postfixtags'][q] = {'tag': obj[inp].replace(/(.*)[@]([a-z_-]+)([\(][^\)]+[\)])?\s*$/gi, "$2"), 'value': obj[inp].replace(/(.*)[@]([a-z_-]+)([\(]([^\)]+)[\)])?\s*$/gi, "$4")};
		q++;
		obj[inp] = obj[inp].replace(/\s*[@][a-z_-]+([\(][^\)]+[\)])?\s*$/gi, "");
	}
	return obj;
}
function taskpaper_html_build(db){
	var cdepth = []; var maxdepth = 4; for(var a = -1; a <= maxdepth; a++){ cdepth[a] = null; } var cdstr = null;
	var plevel = []; for(var a = 0; a <= maxdepth; a++){ plevel[a] = null; } var plstr = null;

	var uldb = []; uldb[null] = $('<ul id="ul-null" class="root"></ul>');

	for(var i = 0; i < db.length ; i++){

		if(maxdepth > Math.ceil(db[i]['depth'])){
			for(var j = 0; j <= Math.ceil(db[i]['depth']); j++){
				if(cdepth[j] === null || j === Math.ceil(db[i]['depth']) ){ cdepth[j] = i;}
			}
			for(var k = Math.ceil(db[i]['depth'])+1; k <= maxdepth; k++){ cdepth[k] = null; }

			/*detect project*/
			if( db[i]['type'] == 'project' ){
				plevel[ Math.ceil(db[i]['depth'])  ] = i;
			}
			/* exit detected project*/
			for(var a = Math.ceil(db[i]['depth'])+1; a <= maxdepth; a++){ plevel[a] = null;}

			/*new line fix*/
			if(db[i]['clean'].length == 0 || db[i]['clean'].match(/^\s*$/gi) ){
				for(var a = -1; a <= maxdepth; a++){ cdepth[a] = null; plevel[a] = null; }
				db[i]['type'] = 'empty';
			}
			/*debug*/ cdstr = null; for(var a = 0; a <= maxdepth; a++){ cdstr = (cdstr == null ? cdepth[-1] + ":" : cdstr + ";") + cdepth[a];}
			/*debug*/ plstr = null; for(var a = 0; a <= maxdepth; a++){ plstr = (plstr == null ? ":" : plstr + ";") + plevel[a];}
		}

		var item = $('<li class="' + db[i]['type'] + (db[i]['done'] ? ' done' : '') + '" id="li-' + i + '" depth="' + Math.ceil(db[i]['depth']) + '"></li>'); // parent="ul-' + cdepth[Math.ceil(db[i]['depth'])-1] + '" cdstr="' + cdstr + '" plstr="' + plstr + '"
		item.append( $('<span class="item" ' + (db[i]['type'] == 'task' ? 'onClick="taskpaper_html_done_switch(\'li-' + i + '\', $(\'#taskpaper\').hasClass(\'editable\'));"' : '') + '>' + taskpaper_txt2html_tagpretty(taskpaper_txt2html_pretty( db[i]['clean'] )) + '</span>') );
		var tags = $('<span class="tags"></span>');
		for(var a = db[i]['postfixtags'].length-1; a >= 0; a--){
			tags.append( $('<tag><name>' + db[i]['postfixtags'][a]['tag'] + '</name>' + (db[i]['postfixtags'][a]['value'] ? '<value>' + db[i]['postfixtags'][a]['value'] + '</value>' : '') + '</tag>') );
		}
		item.append( tags );
		item.append( taskpaper_html_toolset('li-' + i, 'taskpaper') );

		if( db[i]['type'] == 'project' ){
			uldb[ 'project-' + cdepth[Math.ceil(db[i]['depth'])] ] = $('<ul class="group" id="ul-project-' + cdepth[Math.ceil(db[i]['depth'])] + '"></ul>');
			//makesortable(uldb[ 'project-' + cdepth[Math.ceil(db[i]['depth'])] ]);
			item.append( uldb[ 'project-' + cdepth[Math.ceil(db[i]['depth'])] ] );
		}

		var m = 1;
		if(typeof uldb[ cdepth[Math.ceil(db[i]['depth'])-m] ]  == 'undefined'){
		//for(var m = 1; typeof uldb[ cdepth[Math.ceil(db[i]['depth'])-m] ]  == 'undefined'; m++){
			uldb[ cdepth[Math.ceil(db[i]['depth'])-m] ] = $('<ul id="ul-' + cdepth[Math.ceil(db[i]['depth'])-m] + '" class="generic"></ul>');
			//makesortable( uldb[ cdepth[Math.ceil(db[i]['depth'])-m] ] );
			var pm = (Math.ceil(db[i]['depth'])-(m+1) < -1 || typeof cdepth[Math.ceil(db[i]['depth'])-(m+1)] == 'undefined' ? null : (plevel[Math.ceil(db[i]['depth'])-m] == null || db[i]['type'] == 'project' ? cdepth[Math.ceil(db[i]['depth'])-(m+1)] : 'project-' + plevel[Math.ceil(db[i]['depth'])-m] ) );
			uldb[ pm ].append(uldb[ cdepth[Math.ceil(db[i]['depth'])-m] ]);
		}

		uldb[ (plevel[Math.ceil(db[i]['depth'])] == null || db[i]['type'] == 'project' ? cdepth[Math.ceil(db[i]['depth'])-1] : 'project-' + plevel[Math.ceil(db[i]['depth'])] ) ].append( item );
	}

	//$('#debug').html( uldb[null] ); alert(document.getElementById('debug').innerHTML);

	//makesortable(uldb[null]);

	return uldb[null];	
}
function taskpaper_html_toolset(id, robj){
	var html = '<span class="tools">'
		+ '<a href="#"><i class="fa fa-fw fa-bars"></i></a>'
		+ '<a href="#"><i class="fa fa-fw fa-edit"></i></a>'
		+ '<a href="#" onClick="taskpaper_html_done_switch(\'' + id + '\', $(\'#' + (typeof robj != 'undefined' ? robj : 'null') + '\').hasClass(\'editable\'));"><i class="fa fa-fw fa-check"></i></a>'
		+ '<a href="#" onClick="taskpaper_html_remove_li(\'' + id + '\');"><i class="fa fa-fw fa-close"></i></a>'
		+ '</span>';
	return html;
}
function taskpaper_html_done_switch(id, editable){
	if(editable == true || typeof editable == 'undefined'){
		//$('#'+id).toggleClass("done");
		if($('#'+id).hasClass("done")){
			$('#'+id).removeClass("done");
			/* note: $('#'+id) also filters in-text @done-tags, instead of only $('#'+id+' > span.tags') */
			$('#'+id).html($('#'+id).html().replace(/<tag><name>done<\/name>(<value>[^<]+<\/value>)?<\/tag>/i, ''));
		}
		else{
			$('#'+id).addClass("done");
			var doneval = taskpaper_get_default_done_value();
			$('#'+id+' > span.tags').html($('#'+id+' > span.tags').html() + '<tag><name>done</name>' + (doneval == null ? '' : '<value>' + doneval + '</value>') + '</tag>');
		}
	}
	//auto update html>txt
}
function taskpaper_html_remove_li(id){
	$('#'+id).html('').addClass('empty').addClass('removed');
	//auto update html>txt
}
function taskpaper_txt2html_tagpretty(str){
	while(str.match(/@([a-z_-]+)[\(]([^\)]+)[\)]/i)){ str = str.replace(/@([a-z_-]+)[\(]([^\)]+)[\)]/i, '<tag><name>$1</name><value>$2</value></tag>'); }
	while(str.match(/@([a-z_-]+)/i)){ str = str.replace(/@([a-z_-]+)/i, '<tag><name>$1</name></tag>'); }
	return str;
}
function taskpaper_txt2html_pretty(str){
	while(str.match(/@icon\(([^\)]+)\)/i)){ str = str.replace(/@icon\(([^\)]+)\)/i, '<i class="fa fa-fw fa-$1"></i>'); }
	while(str.match(/([\s\(\[\{])[\*]([^\*]+)[\*]/i)){ str = str.replace(/([\s\(\[\{])[\*]([^\*]+)[\*]/i, '$1<strong>$2</strong>'); }
	while(str.match(/([\s\(\[\{])[\/]([^\/]+)[\/]/i)){ str = str.replace(/([\s\(\[\{])[\/]([^\/]+)[\/]/i, '$1<em>$2</em>'); }
	while(str.match(/([\s\(\[\{])[_]([^\/]+)[_]/i)){ str = str.replace(/([\s\(\[\{])[_]([^\/]+)[_]/i, '$1<u>$2</u>'); }
	while(str.match(/[\[]([^\]]+)[\]][\(]([^\)]+)[\)]/i)){ str = str.replace(/[\[]([^\]]+)[\]][\(]([^\)]+)[\)]/i, '<a href="$2">$1</a>'); }
	while(str.match(/([\s\(\[\{])[`]([^`]+)[`]/i)){ str = str.replace(/([\s\(\[\{])[`]([^`]+)[`]/i, '$1<code>$2</code>'); }
	return str;
}
function taskpaper_html2txt_tagpretty(str){
	while(str.match(/<tag><name>([^<]+)<\/name><value>([^<]+)<\/value><\/tag>/i)){ str = str.replace(/<tag><name>([^<]+)<\/name><value>([^<]+)<\/value><\/tag>/i, '@$1($2)'); }
	while(str.match(/<tag><name>([^<]+)<\/name><\/tag>/i)){ str = str.replace(/<tag><name>([^<]+)<\/name><\/tag>/i, '@$1'); }
	return str;
}
function taskpaper_html2txt_pretty(str){
	while(str.match(/<i class="fa fa-fw fa-([^"]+)"><\/i>/i)){ str = str.replace(/<i class="fa fa-fw fa-([^"]+)"><\/i>/i, '@icon($1)'); }
	while(str.match(/<strong>([^<]+)<\/strong>/i)){ str = str.replace(/<strong>([^<]+)<\/strong>/i, '*$1*'); }
	while(str.match(/<em>([^<]+)<\/em>/i)){ str = str.replace(/<em>([^<]+)<\/em>/i, '/$1/'); }
	while(str.match(/<u>([^<]+)<\/u>/i)){ str = str.replace(/<u>([^<]+)<\/u>/i, '_$1_'); }
	while(str.match(/<a href="([^"]+)">([^<]+)<\/a>/i)){ str = str.replace(/<a href="([^"]+)">([^<]+)<\/a>/i, '[$2]($1)'); }
	while(str.match(/<code>([^<]+)<\/code>/i)){ str = str.replace(/<code>([^<]+)<\/code>/i, '`$1`'); }
	return str;
}
function taskpaper_txt_build(db){
	var txt = null;
	for(var i = 0; i < db.length ; i++){
		var postfixtags = ''; for(var a = db[i]['postfixtags'].length-1; a >= 0; a--){ postfixtags = (postfixtags == null ? '' : postfixtags + ' ') + '@' + db[i]['postfixtags'][a]['tag'] + (db[i]['postfixtags'][a]['value'] ? '(' + db[i]['postfixtags'][a]['value'] + ')' : ''); }
		txt = (txt == null ? "" : txt + "\n") + repeat("\t", db[i]['depth']) + (db[i]['type'] == 'task' ? "- " : "") + db[i]['clean'] + (db[i]['type'] == 'project' ? ":" : "") + postfixtags; // + (db[i]['done'] == true && postfixtags.match(/@done/i) != true ? " @done" : '')
	}
	//alert( txt + " (" + txt.length + ")" );
	return txt;
}

function taskpaper_get_default_done_value(){
	//return null;
	var d = new Date();
	return d.toISOString().replace(/(.*)T(.*)/i, '$1');
}

function repeat(pattern, count) {
	count = Math.ceil(count);
	if (count < 1) return '';
	var result = '';
	while (count > 1) {
		if (count & 1) result += pattern;
		count >>= 1, pattern += pattern;
	}
	return result + pattern;
}
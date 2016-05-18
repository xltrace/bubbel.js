<?php
$file = './fontawesome.txt';
$do_print = TRUE;

function fulltrim($str){
	$str = trim($str);
	$str = preg_replace("#\s+[\(]alias[\)]$#i", "", $str);
	return $str;
}

if($do_print){print '<html><!-- Font Awesome Icons --><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" type="text/css" /><style>note { color: gray; } .fontawesome-list li { display: inline-block; width: 16%; min-width: 180px; } .supersize, .supersize * { font-size: 65pt; size: 65pt; border: 0; }</style><body>'."\n";}

//<span id="fontawesome_icon"><i class="fa fa-fw fa-info"></i></span>
print '<center class="supersize"><input type="icon" id="fontawesome" _list="icons" class="iconbeforeinput" onChange="$(\'#fontawesome_icon\').html(\'<i class=\\\'fa fa-fw fa-\'+ this.value +\' \'+ this.value +\'\\\'></i>\');" /></center>'."\n";


print '<input type="icon" id="tester" />';

$lines = file($file);
$ulclosed = TRUE; $iconset = array();
foreach($lines as $s=>$line){
	if(preg_match("#^\t#i", $line)){
		if($ulclosed == TRUE){ if($do_print){print '<ul class="fontawesome-list">'."\n";} $ulclosed = FALSE; }
		if($do_print){print "\t".'<li><i class="fa fa-fw fa-'.fulltrim($line).'"></i> '.preg_replace("#[\(]([^\)]+)[\)]#", "<note>(\\1)</note>", trim($line)).'</li>';}
		if(!in_array(fulltrim($line), $iconset)){ $iconset[] = fulltrim($line); }
	}
	else{
		if($ulclosed != TRUE){ if($do_print){print '</ul>'."\n";} $ulclosed = TRUE; }
		if($do_print){print '<h3>'.trim($line).'</h3>';}
	}
	print "\n";
}
if($ulclosed != TRUE){ if($do_print){print '</ul>'."\n";} $ulclosed = TRUE; }


print '<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>'."\n";
//print '<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">';
print '<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>'."\n";

print '<datalist id="icons">';
foreach($iconset as $i=>$icon){
	print '<option value="fa-'.$icon.'"><i class="fa fa-fw fa-'.$icon.'"></i> '.$icon.'</option>';
}
print '</datalist>'."\n";


?><script>
//$(document).ready(function() {
$(function(){
    var icons = <?=json_encode($iconset)?>;

	$("input[type=icon]").each(function() {
		$("#" + this.id ).addClass("with-one-button").addClass("after");
		$("#" + this.id ).before( $('<span id="' + this.id + '_icon" class="icononly"></span>') );
		$("#" + this.id + "_icon").html('<i class="fa fa-fw fa-' + ($.inArray(this.value.replace(/^([a-z-]+)(\s.*)?$/gi, "$1"), icons) > -1 ? this.value : 'fa gray') + '"></i>');
	});
    $("input[type=icon]").autocomplete({
			source: icons,
			change: function ( event, ui ){
				$("#" + this.id + "_icon").html('<i class="fa fa-fw fa-' + ($.inArray(ui.item.label, icons) > -1 ? ui.item.label : 'fa gray' ) + '"></i>');
			},
			focus: function( event, ui ){
				$("#" + this.id).val(ui.item.label);
				$("#" + this.id + "_icon").html('<i class="fa fa-fw fa-' + ui.item.label + '"></i>');
			},
			select: function( event, ui ){
				$("#" + this.id ).val(ui.item.label);
				$("#" + this.id + "_icon").html('<i class="fa fa-fw fa-' + ui.item.label + '"></i>');
			}
	}).autocomplete( "instance" )._renderItem = function( ul, item ) {
		return $( "<li>" )
			.append( '<a><i class="fa fa-fw fa-' + item.label + '"></i>' + item.label + '</a>' ).appendTo( ul );
	};
	$(document).delegate('input[type=icon]', 'keyup', function(e) {
		var keyCode = e.keyCode || e.which;
		if($.inArray(this.value.replace(/^([a-z-]+)(\s.*)?$/gi, "$1"), icons) > -1){
			$("#" + this.id + "_icon").html('<i class="fa fa-fw fa-' + this.value + '"></i>');
		}
	});
});
</script>
<style>
.ui-autocomplete { border: 1px solid rgba(128,128,128,0.3); background-color: rgba(255,255,255,0.8); padding-left: 0; max-width: 600px; }
.ui-autocomplete li { list-style: none; padding-left: 0; margin-left: 0; }
.ui-helper-hidden-accessible { display: none; visibility: hidden; }
.gray { color: gray; }
.red { color: red; }
.orange { color: orange; }
.blue { color: blue; }
</style><?php

if($do_print){print "\n".'</body></html>';}
?>
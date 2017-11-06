<html>
<head>
	<meta charset="utf-8">
	<title>PADD</title>
	<meta name="description" content="">
	<meta name="keywords" content="">
	<meta name="viewport" content="width=device-width initial-scale=1, user-scalable=no">
    <!--<a href="radi.html">-->
	<link rel="stylesheet" href="style.css">
</head>
<body>
	<div id="header">
		<select class="br5" id = "filter" name="filter" onchange="updateData(this.id)">
		<?php
			$dir = "csv";
			$filename = array();

			// Open a directory, and read its contents
			if (is_dir($dir)){
			  if ($dh = opendir($dir)){
			    while (($file = readdir($dh)) !== false){
			      $filename[] = $file;
			    }
			    closedir($dh);
			  }
			};

			$count = count($filename);
			$csv = ".csv";
			$date = array();
			$drop = "";
			for($i = 0; $i<$count; $i++){
				if(strpos($filename[$i], $csv)){
					$date[$i] = datevalue($filename[$i]);
					$dropdown[$i] = '<option value="' . $date[$i] . '">' . $date[$i] . '</option>';
					$drop .= $dropdown[$i];
				}
			};

			$html = $drop;

			echo $html;

			function datevalue($val){
				$value = explode("-", $val);
				$data = $value[0]."-".$value[1]."-".$value[2];
				return $data;
			};
		?>
		</select>
	</div>
	<form id="radio">
		 <input name="mode" type="radio" value="Crude oil" id="horizon-mode-mirror" checked><label for="horizon-mode-mirror"> Crude Oil</label>
		  <input name="mode" type="radio" value="Gasoline" id="horizon-mode-offset"><label for="horizon-mode-offset">Gasoline</label>
		  <input name="mode" type="radio" value="Distillates" id="horizon-mode-offset"><label for="horizon-mode-offset">Distillates</label>
	</form>

	<div class="legend">
	</div>	

	<div id="index" class="box">
		<div class="padd padd5"><?php echo file_get_contents('img/padd5.svg'); ?><div class="title"><span>PADD5 (excl. Alaska)</span></div><div class="graph">
		</div></div>
		<div class="padd padd4"><?php echo file_get_contents('img/padd4.svg'); ?><div class="title"><span>PADD4</span></div><div class="graph">
		</div></div>
		<div class="padd padd2"><?php echo file_get_contents('img/padd2.svg'); ?><div class="title"><span>PADD2</span></div><div class="graph">
		</div></div>
		<div class="padd padd1"><?php echo file_get_contents('img/padd1.svg'); ?><div class="title"><span>PADD1</span></div><div class="graph">
		</div></div>
		<div class="padd padd3"><?php echo file_get_contents('img/padd3.svg'); ?><div class="title"><span>PADD3</span></div><div class="graph">
		</div></div>
		<div class="padd padd7 alaska"><?php echo file_get_contents('img/alaska.svg'); ?><div class="title"><span>Alaska</span></div><div class="graph">
		</div></div>
		<div class="padd padd6 oklahoma"><?php echo file_get_contents('img/oklahoma.svg'); ?><div class="title"><span>Cushing</span></div><div class="graph">
		</div></div>		
	</div>
	<div id="logoOverlay"><?php echo file_get_contents("img/logo.svg"); ?></div>
	
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	<script src="http://d3js.org/d3.v4.min.js"></script>
	<script src="index.js"></script>
	<!--<script src="/radi.html"></script>-->
	</body>	
</html>
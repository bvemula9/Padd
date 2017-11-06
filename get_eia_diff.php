<?php

function transpose($trans) {
  array_unshift($trans, null);
  $trans = call_user_func_array('array_map', $trans);

  return $trans;
}

stream_context_set_default( [
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
    ],
]);

$from = new DateTime(date('Y').'-01-01');
$to = clone $from;
$to->modify('+1 year');

$count = 1;
$curr_mon = $from->format('m');

for($date=clone $from; $date<$to; $date->modify('+1 day')){

  if($date->format('m') != $curr_mon){
      $curr_mon = $date->format('m');
      $count = 1;
  }

//Crude Oil
  $url="http://www.eia.gov/petroleum/supply/weekly/archive/".$date->format('Y')."/".$date->format('Y_m_d')."/csv/table4.csv";

  $content = @file_get_contents($url);

  if ($content === false) {
    // Handle the error
    $headers = get_headers($url, 1);
    $response = substr($headers[1], 9, 30);
    print "error\n".$response."\n";
  }else{

    $rows = explode("\n",$content);
    $csv = array();
    foreach($rows as $row) {
      $csv[] = str_getcsv($row);
    }

    $csv = array(array_column($csv, 0), array_column($csv, 3));

    print_r($csv);

    $csv = transpose($csv);
    $csv = array($csv[0], $csv[3], $csv[4], $csv[5], $csv[6], $csv[7], $csv[8], $csv[9]);
    $csv[0][1] = "Crude Oil";
    $csv = transpose($csv);

    $fp = fopen("csv1/".$date->format('Y')."-".$date->format('m')."-".$count."-eia_c.csv", 'w');
    foreach ($csv as $fields) {
      fputcsv($fp, $fields);
    }
    fclose($fp);

    $csv_c = $csv[1];

//gasoline
    $url="http://www.eia.gov/petroleum/supply/weekly/archive/".$date->format('Y')."/".$date->format('Y_m_d')."/csv/table5.csv";
    $content = file_get_contents($url);

    $rows = explode("\n",$content);
    $csv = array();
    foreach($rows as $row) {
      $csv[] = str_getcsv($row);
    }

    $csv = array(array_column($csv, 1), array_column($csv, 4));
    $csv = transpose($csv);
    $csv = array($csv[0], $csv[2], $csv[3], $csv[4], $csv[5], $csv[6]);
    $csv[0][1] = "Gasoline";
    $csv = transpose($csv);

    $fp = fopen("csv1/".$date->format('Y')."-".$date->format('m')."-".$count."-eia_g.csv", 'w');
    foreach ($csv as $fields) {
      fputcsv($fp, $fields);
    }
    fclose($fp);

    $csv_g = $csv[1];

//distillates
    $url="http://www.eia.gov/petroleum/supply/weekly/archive/".$date->format('Y')."/".$date->format('Y_m_d')."/csv/table6.csv";
    $content = file_get_contents($url);

    $rows = explode("\n",$content);
    $csv = array();
    foreach($rows as $row) {
      $csv[] = str_getcsv($row);
    }

    $csv = array(array_column($csv, 0), array_column($csv, 3));
    $csv = transpose($csv);
    $csv = array($csv[0], $csv[2], $csv[6], $csv[7], $csv[8], $csv[9]);
    $csv[0][1] = "Distillates";
    $csv = transpose($csv);

    $fp = fopen("csv1/".$date->format('Y')."-".$date->format('m')."-".$count."-eia_d.csv", 'w');
    foreach ($csv as $fields) {
      fputcsv($fp, $fields);
    }
    fclose($fp);

    $csv_d = $csv[1];


    $csv_headeers = array("","Alaska","Oklahoma","PADD1","PADD3","PADD2","PADD4","PADD5");
    $fp = fopen("csv/".$date->format('Y')."-".$date->format('m')."-".$count."-eia.csv", 'w');
    fputcsv($fp, $csv_headeers);
    fputcsv($fp, array($csv_c[0], $csv_c[7], $csv_c[3], $csv_c[1], $csv_c[4], $csv_c[2], $csv_c[5], $csv_c[6]));
    fputcsv($fp, array($csv_g[0], "",        "",        $csv_g[1], $csv_g[3], $csv_g[2], $csv_g[4], $csv_g[5]));
    fputcsv($fp, array($csv_d[0], "",        "",        $csv_d[1], $csv_d[3], $csv_d[2], $csv_d[4], $csv_d[5]));

    fclose($fp);

    $count += 1;
  }
}

?>

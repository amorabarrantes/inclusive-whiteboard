<?php
session_start();

//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "../database_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/


$id_card=$_REQUEST["id_card"];

$conn2 = obtener_coneccion();
try {
  $result = ejecutar_query($conn2, "delete from cards where id ='$id_card'");
  
  echo json_encode(array('result'=> true));
  
} catch (\Throwable $th) {
  
  echo json_encode(array('result'=> false));

}
pg_close($conn2);
?>
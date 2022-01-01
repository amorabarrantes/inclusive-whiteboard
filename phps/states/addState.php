<?php
session_start();

//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "../database_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/


$id_workflow=$_REQUEST["id_workflow"];
$category=$_REQUEST["category"];
$counter=$_REQUEST["counter"];
$conn2 = obtener_coneccion();
try {
  $result = ejecutar_query($conn2, "INSERT INTO states (id_workflow, category, counter) VALUES ($id_workflow, '$category', $counter) RETURNING *");
  if ($row=pg_fetch_row ($result))
  {
      echo json_encode(array('result'=> true));
  }
} catch (\Throwable $th) {
  
  echo json_encode(array('result'=> false));

}
pg_close($conn2);
?>
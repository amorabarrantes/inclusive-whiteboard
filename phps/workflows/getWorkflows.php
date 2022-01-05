<?php
session_start();
//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "../database_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/


$id=$_REQUEST["id"];

$conn = obtener_coneccion();
$result = ejecutar_query($conn, "SELECT * FROM workflows WHERE id_user = '$id' order by id desc");
$arr = pg_fetch_all($result);
print(json_encode($arr));
pg_close($conn);

<?php
session_start();
//require "control_sesion.php"; //importa el control de sesiones el require detecta errores Fatales en la ejecución del archivo importado no así el include!
include "./database_connection.php";

/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/


$email=$_REQUEST["email"];
$password=$_REQUEST["password"];


$conn = obtener_coneccion();
$result = ejecutar_query($conn, "select id,email from users where email='$email' and password=md5('$password');");
if ($row=pg_fetch_row ($result))
{
    echo json_encode(array('id_user'=>$row[0],'email'=>$row[1], 'result'=> true));
}
else
{
    echo json_encode(array('result'=> false, 'error'=>'The user credentials are not valid'));
}
pg_close($conn);
?>
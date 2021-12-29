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
$result = ejecutar_query($conn, "SELECT * FROM workflows WHERE id_user = '$id'");
$arr = pg_fetch_all($result);
print(json_encode($arr));
pg_close($conn);
// if ($row=pg_fetch_row ($result))
// {
//     $_SESSION["id_usuario"]=$row[0];
//     $_SESSION["email_usuario"]=$row[1];
//     echo json_encode(array('id'=>$row[0],'id_user'=>$row[1], 'name'=> $row[2], 'description'=>$row[3], 'creation_date'=>$row[4]));
// }
// else
// {
//     echo json_encode(array('result'=> false, 'error'=>'Las credenciales del usuario no son validas'));
// }
// pg_close($conn);
?>
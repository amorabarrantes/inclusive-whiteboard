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
try {
  $result = ejecutar_query($conn, "INSERT INTO usuarios (email, password) VALUES ('$email', md5('$password')) RETURNING *");
  if ($row=pg_fetch_row ($result))
  {
      $_SESSION["id_usuario"]=$row[0];
      $_SESSION["email_usuario"]=$row[1];
      echo json_encode(array('id_usuario'=>$row[0],'email'=>$row[1], 'result'=> true));
  }
} catch (\Throwable $th) {
  ob_end_clean();
  echo json_encode(array('result'=> false, 'error'=>'Ya existen esas credenciales'));
  
  
}
pg_close($conn);
?>
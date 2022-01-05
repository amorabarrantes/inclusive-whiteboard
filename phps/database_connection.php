<?php
/*********Eliminar estando producción************/
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("display_errors", 1);
/*************************************************/

function obtener_coneccion()
{
    /*cambiar los parámetros de conección a la base de datos*/ 
    $host="localhost";
    $port="5432";
    $dbname="whiteboard_db";
    $user="postgres";
    $password="binns2000";
    $conn=pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
    if (!$conn) 
    {
        echo "[false,{'error':'No se pudo conectar con la base de datos'}]";
        exit;
    }
    return ($conn);
}

function ejecutar_query($conn,$query)
{
    $result = pg_query($conn, $query);
    if (!$result) 
    {
        $result_error=pg_result_error($result);
        echo "[false,{'error':'No es posible ejecutar la consulta','detalles':'$result_error'}]";
        exit;
    }
    return ($result);
}



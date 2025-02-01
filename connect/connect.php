<?php

require_once("../config-url.php");

// Create connection
$conn = new mysqli(SEVERNAME, USERNAME, PASSWORD, DBNAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

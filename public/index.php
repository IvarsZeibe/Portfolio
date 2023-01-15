<?php
require_once('../src/views/view.php');
require_once('../src/controllers/controller.php');

$view = new View();
$controller = new Controller($view);

$controller->handleRequest();
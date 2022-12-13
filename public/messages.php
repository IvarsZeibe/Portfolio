<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["name"]) && isset($_POST["email"]) && isset($_POST["message"]) &&
    strlen($_POST["name"]) <= 50 && strlen($_POST["email"]) <= 50 && strlen($_POST["message"]) <= 300) {
        echo "Message sent";
        $myfile = fopen("../messages.txt", "a");
        fwrite($myfile, "Email: ".$_POST["email"].", full name: ".$_POST["name"].", message: ".$_POST["message"]."\n");    
    } else {
        echo "Invalid form data";
    }
}
?>
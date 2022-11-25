<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["name"]) && isset($_POST["email"]) && isset($_POST["message"])) {
        echo "Message sent";
        $myfile = fopen("messages.txt", "a");
        fwrite($myfile, "Email: ".$_POST["email"].", full name: ".$_POST["name"].", message: ".$_POST["message"]."\n");    
    } else {
        echo "Invalid form data";
    }
}
?>
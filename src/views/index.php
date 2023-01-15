<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ivars Žeibe</title>
    <script src="./script.js" defer></script>
    <link rel="stylesheet" href="./style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
</head>
<body>
    <?php include 'navbar.php'; ?>
    <div id="content">
        <canvas id="hero"></canvas>
        <?php include 'about.php'; ?>
        <?php include 'projects.php'; ?>
        <?php include 'contacts.php'; ?>
        <button style="font-family: 'TimesNewRomanBold'" onclick="startDoomsday()">Don't click</button>
    </div>
    <footer>Designed & Built by Ivars Žeibe</footer>
</body>
</html>

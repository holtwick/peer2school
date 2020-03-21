<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>peer.school</title>
</head>
<body>

<?php

  ini_set('display_errors', 'On');
  error_reporting(E_ALL);

  if (isset($_GET["room"])) {
    $room = $_GET["room"];
    $url = "/dist/#$room";
  }

?>

<p>You will be redirected to <?php echo $url; ?></p>

<script>
location.assign('<?php echo $url; ?>')
</script>

</body>
</html>

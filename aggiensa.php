<?php
require_once ('alchemyapi.php');
$alchemyapi = new AlchemyAPI();

$img = $_POST['imageBase64'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);

if (!empty($_POST['imageBase64'])) {
    $response = $alchemyapi->face_detection('image', $data, array('imagePostMode' => 'raw'));
    header('Content-Type: application/json');
    echo json_encode($response);
}
else {
    echo "Error: no image found";
}
?>
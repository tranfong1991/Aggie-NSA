<?php
define('VIDEO_DIR', 'videos/');

$id = $_POST['video_id'];
$url = $_POST['video_url'];
$path = VIDEO_DIR.$id.".mp4";

if(file_exists($path))
    echo "EXISTS";
else {
    file_put_contents($path, fopen($url, 'r'));
    echo "DOWNLOADED";
}
?>
<?php
if (!isset($_SESSION)) {
    session_start();
}

include dirname(__FILE__, 2) . '/config.php';
include $main_location . '/connection/conn.php';
include '../builder/builder_select.php';
include '../builder/builder_table.php';

$command = $_POST['command'];

switch ($command) {

    case "get_videos":
        $sql = "SELECT * FROM tbl_videos WHERE isActive = 1 ORDER BY dateCreated DESC";
        return builder($con, $sql);
        break;

    case "save_or_update_video":
        $mode        = $_POST['mode'];
        $title       = trim($_POST['title']);
        $link        = trim($_POST['link']);
        $dateCreated = $global_date;

        if ($mode === "save") {
            // Check for duplicate title or link
            $checkQuery = "SELECT COUNT(*) FROM tbl_videos WHERE (LOWER(title) = LOWER(?) OR LOWER(link) = LOWER(?)) AND isActive = 1";
            if ($stmt = mysqli_prepare($con, $checkQuery)) {
                mysqli_stmt_bind_param($stmt, "ss", $title, $link);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $count);
                mysqli_stmt_fetch($stmt);
                mysqli_stmt_close($stmt);

                if ($count > 0) {
                    echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Video title or link already exists.' ]]);
                    exit;
                }
            }

            // Insert video
            $insertQuery = "INSERT INTO tbl_videos (title, link, isActive, dateCreated) VALUES (?, ?, 1, ?)";
            if ($stmt = mysqli_prepare($con, $insertQuery)) {
                mysqli_stmt_bind_param($stmt, "sss", $title, $link, $dateCreated);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);

                echo json_encode([[ 'error' => false, 'color' => 'green', 'message' => 'Video has been saved successfully.' ]]);
            } else {
                echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Unable to save video. Please try again.' ]]);
            }

        } elseif ($mode === "update") {
            $id = $_POST['id'];

            // Fetch existing data
            $selectQuery = "SELECT title, link FROM tbl_videos WHERE id = ? AND isActive = 1 LIMIT 1";
            if ($stmt = mysqli_prepare($con, $selectQuery)) {
                mysqli_stmt_bind_param($stmt, "i", $id);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $existingTitle, $existingLink);
                mysqli_stmt_fetch($stmt);
                mysqli_stmt_close($stmt);

                if (
                    strtolower(trim($existingTitle)) === strtolower($title) &&
                    strtolower(trim($existingLink)) === strtolower($link)
                ) {
                    echo json_encode([[ 'error' => true, 'color' => 'orange', 'message' => 'No changes detected.' ]]);
                    exit;
                }
            }

            // Check for duplicate title or link (excluding current id)
            $checkQuery = "SELECT COUNT(*) FROM tbl_videos WHERE (LOWER(title) = LOWER(?) OR LOWER(link) = LOWER(?)) AND id != ? AND isActive = 1";
            if ($stmt = mysqli_prepare($con, $checkQuery)) {
                mysqli_stmt_bind_param($stmt, "ssi", $title, $link, $id);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $count);
                mysqli_stmt_fetch($stmt);
                mysqli_stmt_close($stmt);

                if ($count > 0) {
                    echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Another video already uses that title or link.' ]]);
                    exit;
                }
            }

            // Update video
            $updateQuery = "UPDATE tbl_videos SET title = ?, link = ? WHERE id = ? AND isActive = 1";
            if ($stmt = mysqli_prepare($con, $updateQuery)) {
                mysqli_stmt_bind_param($stmt, "ssi", $title, $link, $id);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);

                echo json_encode([[ 'error' => false, 'color' => 'green', 'message' => 'Video has been updated successfully.' ]]);
            } else {
                echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Unable to update video. Please try again.' ]]);
            }
        }
        break;

    case "delete_video":
        $id = $_POST['id'];

        $query = "UPDATE tbl_videos SET isActive = 0 WHERE id = ?";
        if ($stmt = mysqli_prepare($con, $query)) {
            mysqli_stmt_bind_param($stmt, "i", $id);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);

            echo json_encode([[ 'error' => false, 'color' => 'green', 'message' => 'Video has been deleted successfully.' ]]);
        } else {
            echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Unable to delete video. Please try again later.' ]]);
        }
        break;
}

mysqli_close($con);

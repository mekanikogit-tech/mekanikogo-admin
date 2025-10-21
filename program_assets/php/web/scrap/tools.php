<?php
if (!isset($_SESSION)) {
    session_start();
}

include dirname(__FILE__,2) . '/config.php';
include $main_location . '/connection/conn.php';
include '../builder/builder_select.php';
include '../builder/builder_table.php';

$command = $_POST['command'];

switch ($command) {

    case "get_tools":
        $sql = "SELECT * FROM tbl_tools WHERE isActive = 1 ORDER BY tool ASC";
        return builder($con, $sql);
        break;

    case "save_or_update_tool":
        $mode        = $_POST['mode'];
        $toolName    = trim($_POST['tool']);
        $description = trim($_POST['description']);
        $dateCreated = $global_date;
    
        if ($mode === "save") {
            // Check duplicate
            $checkQuery = "SELECT COUNT(*) FROM tbl_tools WHERE LOWER(tool) = LOWER(?) AND isActive = 1";
            if ($stmt = mysqli_prepare($con, $checkQuery)) {
                mysqli_stmt_bind_param($stmt, "s", $toolName);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $count);
                mysqli_stmt_fetch($stmt);
                mysqli_stmt_close($stmt);
    
                if ($count > 0) {
                    echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Tool already exists. Please use a different name.' ]]);
                    exit;
                }
            }
    
            // Insert tool
            $insertQuery = "INSERT INTO tbl_tools (tool, description, isActive, dateCreated) VALUES (?, ?, 1, ?)";
            if ($stmt = mysqli_prepare($con, $insertQuery)) {
                mysqli_stmt_bind_param($stmt, "sss", $toolName, $description, $dateCreated);
                mysqli_stmt_execute($stmt);
                $insertedId = mysqli_insert_id($con);
                mysqli_stmt_close($stmt);
    
                // Check and move image
                if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = '../../../photos/tools/';
                    $imagePath = $uploadDir . $insertedId . ".png";
                    move_uploaded_file($_FILES['file']['tmp_name'], $imagePath);
                } else {
                    echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Image upload failed. Please try again.' ]]);
                    exit;
                }
    
                echo json_encode([[ 'error' => false, 'color' => 'green', 'message' => 'Tool has been saved successfully.' ]]);
            } else {
                echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Unable to save tool. Please try again.' ]]);
            }
    
        } elseif ($mode === "update") {
            $id = $_POST['id'];
    
            // Fetch existing data
            $selectQuery = "SELECT tool, description FROM tbl_tools WHERE id = ? AND isActive = 1 LIMIT 1";
            if ($stmt = mysqli_prepare($con, $selectQuery)) {
                mysqli_stmt_bind_param($stmt, "i", $id);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $existingTool, $existingDescription);
                mysqli_stmt_fetch($stmt);
                mysqli_stmt_close($stmt);
    
                if (
                    strtolower(trim($existingTool)) === strtolower($toolName) &&
                    trim($existingDescription) === $description &&
                    !isset($_FILES['file']) // no change and no new image
                ) {
                    echo json_encode([[ 'error' => true, 'color' => 'orange', 'message' => 'No changes detected.' ]]);
                    exit;
                }
            }
    
            // Check for duplicate name
            $checkQuery = "SELECT COUNT(*) FROM tbl_tools WHERE LOWER(tool) = LOWER(?) AND id != ? AND isActive = 1";
            if ($stmt = mysqli_prepare($con, $checkQuery)) {
                mysqli_stmt_bind_param($stmt, "si", $toolName, $id);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $count);
                mysqli_stmt_fetch($stmt);
                mysqli_stmt_close($stmt);
    
                if ($count > 0) {
                    echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Tool name already used by another record.' ]]);
                    exit;
                }
            }
    
            // Update tool info
            $updateQuery = "UPDATE tbl_tools SET tool = ?, description = ? WHERE id = ? AND isActive = 1";
            if ($stmt = mysqli_prepare($con, $updateQuery)) {
                mysqli_stmt_bind_param($stmt, "ssi", $toolName, $description, $id);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);
    
                // If image uploaded during update, replace
                if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = '../../../photos/tools/';
                    $imagePath = $uploadDir . $id . ".png";
                    move_uploaded_file($_FILES['file']['tmp_name'], $imagePath);
                }
    
                echo json_encode([[ 'error' => false, 'color' => 'green', 'message' => 'Tool has been updated successfully.' ]]);
            } else {
                echo json_encode([[ 'error' => true, 'color' => 'red', 'message' => 'Unable to update tool. Please try again.' ]]);
            }
        }
        break;


    case "delete_tool":
        $id = $_POST['id'];

        $query = "UPDATE tbl_tools SET isActive = 0 WHERE id = ?";
        if ($stmt = mysqli_prepare($con, $query)) {
            mysqli_stmt_bind_param($stmt, "i", $id);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);

            echo json_encode([[
                'error' => false,
                'color' => 'green',
                'message' => 'Tool has been deleted successfully.'
            ]]);
        } else {
            echo json_encode([[
                'error' => true,
                'color' => 'red',
                'message' => 'Unable to delete tool. Please try again later.'
            ]]);
        }
        break;
}

mysqli_close($con);

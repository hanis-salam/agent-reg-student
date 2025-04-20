<?php
// Database connection
$servername = "https://cpanel.unimapatkl.com";  // Usually 'localhost' in cPanel
$username = "admin";  // Replace with your database username
$password = "admin@unimap";  // Replace with your database password
$dbname = "unimapat_agentApp";  // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// SQL query
$sql = "SELECT * FROM users";  // Replace with your table name and query
$result = $conn->query($sql);

// Check if there are results
if ($result->num_rows > 0) {
  $data = [];
  while($row = $result->fetch_assoc()) {
    $data[] = $row;  // Store each row in an array
  }
  // Return data as JSON
  echo json_encode($data);
} else {
  echo "0 results";
}

// Close connection
$conn->close();
?>

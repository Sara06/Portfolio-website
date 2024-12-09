<?php
// Set content type for the response
header('Content-Type: application/json');

// Initialize response array
$response = ['status' => 'error', 'message' => 'Something went wrong. Please try again later.'];

// Check if the form is submitted via POST method
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Validate Name
    if (empty($_POST['name'])) {
        $response['message'] = 'Name is required.';
        echo json_encode($response);
        exit;
    }

    // Validate Email
    if (empty($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'A valid email address is required.';
        echo json_encode($response);
        exit;
    }

    // Validate Phone
    if (empty($_POST['phone'])) {
        $response['message'] = 'Phone number is required.';
        echo json_encode($response);
        exit;
    }

    // Validate Message
    if (empty($_POST['message'])) {
        $response['message'] = 'Message is required.';
        echo json_encode($response);
        exit;
    }

    // Get form data
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Email details
    $to = 'your-email@example.com'; // Replace with your email address
    $subject = 'New Message from Portfolio Contact Form';
    $body = "You have received a new message from your portfolio website contact form.\n\n";
    $body .= "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n\n";
    $body .= "Message:\n$message\n";

    // Email headers
    $headers = 'From: ' . $email . "\r\n";
    $headers .= 'Reply-To: ' . $email . "\r\n";
    $headers .= 'Content-Type: text/plain; charset=UTF-8' . "\r\n";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        // Success response
        $response['status'] = 'success';
        $response['message'] = 'Your message has been sent successfully!';
    } else {
        // Error response
        $response['message'] = 'Sorry, something went wrong while sending your message.';
    }
} else {
    $response['message'] = 'Invalid request method. Please use POST.';
}

// Return the response as JSON
echo json_encode($response);
?>

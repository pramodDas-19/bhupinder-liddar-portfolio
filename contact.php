<?php
/**
 * contact.php - Contact Form Handler
 * Portfolio: Bhupinder Singh Liddar
 */

header('Content-Type: text/plain');
header('X-Content-Type-Options: nosniff');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'error';
    exit;
}

// Sanitize inputs
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

$name    = sanitize($_POST['name']    ?? '');
$email   = sanitize($_POST['email']   ?? '');
$subject = sanitize($_POST['subject'] ?? '');
$message = sanitize($_POST['message'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo 'error';
    exit;
}

// Validate email format
if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    echo 'error';
    exit;
}

// Validate lengths
if (strlen($name) > 120 || strlen($subject) > 255 || strlen($message) > 5000) {
    echo 'error';
    exit;
}

// Recipient
$to = 'bsliddar@hotmail.com';

// Build email
$email_subject = "Portfolio Contact: {$subject}";

$email_body = "You have received a new message via your portfolio website.\n";
$email_body .= str_repeat("=", 60) . "\n\n";
$email_body .= "Name:    {$name}\n";
$email_body .= "Email:   {$email}\n";
$email_body .= "Subject: {$subject}\n\n";
$email_body .= "Message:\n";
$email_body .= str_repeat("-", 40) . "\n";
$email_body .= "{$message}\n\n";
$email_body .= str_repeat("=", 60) . "\n";
$email_body .= "Sent from: Bhupinder Singh Liddar Portfolio\n";
$email_body .= "Date/Time: " . date('Y-m-d H:i:s T') . "\n";
$email_body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

// Headers
$headers  = "From: Portfolio Contact <noreply@bsliddar.com>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send
$sent = mail($to, $email_subject, $email_body, $headers);

if ($sent) {
    echo 'success';
} else {
    echo 'error';
}
exit;

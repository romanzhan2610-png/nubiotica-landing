<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. ПРОВЕРКА HONEYPOT (ЗАЩИТА ОТ СПАМА)
    // Если поле 'work_email' не пустое, значит форму заполнил бот.
    if (!empty($_POST['work_email'])) {
        // Возвращаем "success", чтобы обмануть бота, но письмо при этом НЕ отправляем.
        echo json_encode(['status' => 'success']);
        exit;
    }

    $to = "hello@nubiotica.kz";
    $from = "no-reply@nubiotica.kz";
    $reply_to = $from; // По умолчанию Reply-To такой же, как From

    $form_type = $_POST['form_type'] ?? '';

    if ($form_type === 'contact') {
        $name = htmlspecialchars($_POST['user_name'] ?? 'Не указано');
        $subject_val = htmlspecialchars($_POST['subject'] ?? 'Без темы');
        $comm = htmlspecialchars($_POST['comm'] ?? 'Не указано');
        $contact_info = trim($_POST['contact_info'] ?? 'Не указано');

        // 2. УЛУЧШЕНИЕ REPLY-TO
        // Если пользователь выбрал связь по Email и ввел корректный адрес, подставляем его в Reply-To
        if ($comm === 'Email' && filter_var($contact_info, FILTER_VALIDATE_EMAIL)) {
            $reply_to = $contact_info;
        }

        // Очищаем контактную информацию от возможных тегов перед вставкой в письмо
        $contact_info_safe = htmlspecialchars($contact_info);

        $mail_subject = "Nubiotica: новая заявка (" . $subject_val . ")";

        $message = "Получена новая заявка с сайта.\n\n";
        $message .= "Имя: " . $name . "\n";
        $message .= "Тема: " . $subject_val . "\n";
        $message .= "Способ связи: " . $comm . "\n";
        $message .= "Контакт: " . $contact_info_safe . "\n";

    } elseif ($form_type === 'referral') {
        $my_email = trim($_POST['my_email'] ?? '');
        $friend_email = trim($_POST['friend_email'] ?? '');

        // Если указан корректный email клиента, можем сразу отвечать ему
        if (filter_var($my_email, FILTER_VALIDATE_EMAIL)) {
            $reply_to = $my_email;
        }

        $my_email_safe = htmlspecialchars($my_email);
        $friend_email_safe = htmlspecialchars($friend_email);

        $mail_subject = "Nubiotica: новый участник реферальной программы";
        $message = "Почта клиента: " . $my_email_safe . "\n";
        $message .= "Почта друга: " . $friend_email_safe . "\n";
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Неизвестный тип формы.']);
        exit;
    }

    $from_name = "Nubiotica";
    $headers = array(
        'From' => "=?UTF-8?B?" . base64_encode($from_name) . "?= <" . $from . ">",
        'Reply-To' => $reply_to, // <--- Используем динамический адрес для ответа
        'Bcc' => 'kudabayev@gmail.com',
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding' => '8bit',
        'X-Mailer' => 'PHP/' . phpversion()
    );

    if (mail($to, "=?UTF-8?B?" . base64_encode($mail_subject) . "?=", $message, $headers)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка отправки.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Недопустимый метод.']);
}
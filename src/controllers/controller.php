<?php
require_once('../src/models/message.php');

class Controller {
    private $view;

    public function __construct(View $view) {
        $this->view = $view;
    }

    public function handleFormSubmit() {
        $message = new Message($_POST);
        if ($message->isValid()) {
            echo "Message sent";
            $message->saveToFile("../messages.txt");
        } else {
            echo "Invalid form data:\n\n";
            foreach ($message->getErrors() as $error) {
                echo $error."\n";
            }
        }
    }
    public function handleRequest() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->handleFormSubmit();
        } else {
            $this->view->render();
        }
    }
}
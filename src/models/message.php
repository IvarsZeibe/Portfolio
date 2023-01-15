<?php

class Message {
    public $name;
    public $email;
    public $message;

    private $errors;

    public function __construct($data) {
        $this->name = $data['name'];
        $this->email = $data['email'];
        $this->message = $data['message'];

        $this->errors = [];
    }

    public function isValid() {
        if (empty($this->name)) {
            $this->errors[] = "Name is required";
        } else if (strlen($this->name) > 50) {
            $this->errors[] = "Name max length is 50 characters";
        }
        if (empty($this->email)) {
            $this->errors[] = "Email is required";
        } else if (strlen($this->email) > 50) {
            $this->errors[] = "Email max length is 50 characters";
        }
        if (empty($this->message)) {
            $this->errors[] = "Message is required";
        } else if (strlen($this->message) > 300) {
            $this->errors[] = "Message max length is 300 characters";
        }
        return empty($this->errors);
    }

    public function getErrors() {
        return $this->errors;
    }

    public function saveToFile($filePath) {
        $myfile = fopen($filePath, "a");
        fwrite($myfile, "Email: ".$this->email.", full name: ".$this->name.", message: ".$this->message."\n");
    }
}
package com.example.system.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping(value = "/{path:[^\\.]*}") // Перехватываем все маршруты, кроме тех, что содержат точку (например, .js, .css)
    public String forward() {
        return "forward:/index.html"; // Перенаправляем на index.html
    }
}

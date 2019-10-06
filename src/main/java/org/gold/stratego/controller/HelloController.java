package org.gold.stratego.controller;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Controller
public class HelloController{
    @GetMapping("/hello")
    public String index(Model model) {
        model.addAttribute("message", "Hello!");
        return "hello";
    }
}
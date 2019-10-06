package org.gold.stratego.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * index redirct to login.
 * 
 * @author Zihao, Zheng
 *
 */
@Controller
public class IndexController {

	
    /**
     * Web index page request
     * @return
     */
    @RequestMapping("/")
    public String root() {
    	return "redirect:/loginPage";
    }
    

}

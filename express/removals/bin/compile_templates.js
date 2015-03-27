#!/usr/bin/env node

var fs   = require('fs');
var jade = require('jade');

var dir_list = ["./views/partials"];
var target = "./public/javascripts/templates.js";

fs.exists(target,function(exists){
    if(exists){
        fs.unlink(target);
    }
});

for(d in dir_list){
    var dir = dir_list[d];
    compile_templates_in(dir);
}

function compile_templates_in(dir){
    fs.readdir(dir,function(err,files){
        if(err){
            console.log(err);
        } else {
            var template_list = files.filter(function(x){ return x.substring(x.length-5,x.length) == '.jade'; });
            for(i in template_list){
                var file_name = template_list[i];
                var tpt_name = file_name.substring(0,file_name.length - 5);
                console.log("compiling " + tpt_name);
                var source = dir + '/' + file_name;
                var jsFunctionString = jade.compileFileClient(source, {name: "template_"+tpt_name});
                fs.appendFile(target, jsFunctionString + "\n");
            }
        }
    });
}

exports.compile_templates = {}

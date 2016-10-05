/*
 * multifile-upload v1.0 (https://www.impactmedianc.com/)
 * Copyright Impact Media 2016 Drew Denstedt
 */

var MultiFile = function (el) {

    this.debug = false;
    this.form_id = el;
    this.upload_url = '';
    this.redirect_url = '';
    this.files = [];
    this.form = document.getElementById(el);

    if(this.form !== null){

        this.upload_url = this.form.action;
    }
    else{

        this.errorMessage('form');
    }

    this.inputListener();
    this.outputListener();
    this.formListener();    
};

MultiFile.prototype.setDebug = function(debug){

    this.debug = debug;
};

MultiFile.prototype.setUploadUrl = function(url){

    this.upload_url = url;
};

MultiFile.prototype.setRedirectUrl = function(url){

    this.redirect_url = url;
};

MultiFile.prototype.setInput = function(el){
    
    var input = document.getElementById(el);

    if(input !== null){

        this.files[el] = [];
    }
    else{

        this.errorMessage('input');
    }
};

MultiFile.prototype.compareFiles = function(input){

    if(this.files[input.id].length > 0){

        if(input.files.length > 0){

            for(var property in input.files){

                var flag = true;

                for(var prop in this.files[input.id]){

                    if(input.files[property] == this.files[input.id][prop] || property == 'length'){

                        flag = false;
                    }
                }

                if(flag){

                    var index = this.files[input.id].length;
                    this.files[input.id][index] = input.files[property];
                    this.files[input.id].length = index + 1;
                }

            }

        }
    }
    else{

        if(input.files.length > 0){

            for(var property in input.files){

                this.files[input.id][property] = input.files[property];
            }

        }
    }

    this.updateOutput(input);
};

MultiFile.prototype.updateOutput = function(input){

    var output = document.getElementById(input.id + "-output");
    if (output !== null){
        output.parentNode.removeChild(output);
    }

    input.parentNode.parentNode.getElementsByTagName('output')[0].textContent = "";

    if(this.files[input.id].length > 0 ){

        var docFrag = document.createDocumentFragment(); 

        for (var i = 0; i < this.files[input.id].length; i++) {
                
                var prop = document.createElement('div');
                prop.classList.add('row', 'multifile-output');

                var span = document.createElement('span');
                span.className = 'col-xs-12';
                span.textContent = this.files[input.id][i].name;

                var close_span = document.createElement('span');
                close_span.classList.add('glyphicon', 'glyphicon-remove', 'multifile-remove');
                close_span.dataset.multifile = i;
                close_span.dataset.multifile_id = input.id;

                span.appendChild(close_span);
                prop.appendChild(span);
                docFrag.appendChild(prop);
        
        }

        input.parentNode.parentNode.getElementsByTagName('output')[0].appendChild(docFrag);
    }
    else{

        input.parentNode.parentNode.getElementsByTagName('output')[0].textContent = "No Files Chosen";
    }
};

MultiFile.prototype.inputListener = function (){

    var self = this;

    document.addEventListener('change', function(e){

        if (e.target && e.target.classList.contains('multifile')){

            self.compareFiles(document.getElementById(e.target.id));
        }

    });
};

MultiFile.prototype.outputListener = function (){

    var self = this;

    document.addEventListener('mouseup', function(e){

        if(e.target && e.target.classList.contains('multifile-remove')){

            self.files[e.target.dataset.multifile_id].splice([Number(e.target.dataset.multifile)], 1);

            self.updateOutput(document.getElementById(e.target.dataset.multifile_id));
        }
    });
};

MultiFile.prototype.formListener = function(){

    var self = this;
    
    this.form.addEventListener('submit', function(e){
        
        e.preventDefault();

        var fd = new FormData();    

        for(var key in self.files){

            for (var i = 0; i < self.files[key].length; i++) {

                fd.append(key+'[]', self.files[key][i]);
            }
        }

        var form_values = $('#'+self.form_id).serializeArray();

        $.each(form_values,function(key,input){
            fd.append(input.name,input.value);
        });

        $.ajax({
            url: self.upload_url,
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){

                if(self.debug){

                   console.log(data);
                }
                else{

                    window.location.replace(self.redirect_url);
                }
            },
            error: function (jqXHR, exception){

                var error = '';

                if (jqXHR.status === 0) {
                    error = 'Not connect.\n Verify Network.';
                }
                else if (jqXHR.status == 404) {
                    error = 'Requested page not found. [404]';
                }
                else if (jqXHR.status == 500) {
                    error = 'Internal Server Error [500].';
                }
                else if (exception === 'parsererror') {
                    error = 'Requested JSON parse failed.';
                }
                else if (exception === 'timeout') {
                    error = 'Time out error.';
                }
                else if (exception === 'abort') {
                    error = 'Ajax request aborted.';
                }
                else {
                    error = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                
                console.log(error);
            }
        });

    });
};

MultiFile.prototype.errorMessage = function(el){

    switch(el){

        case 'form':
            console.log("Invalid Form ID");
        break;

        case 'input':
            console.log("Invalid Input ID");
        break;

        default:
            console.log("Unknown Error :/");
        break;
    }
};
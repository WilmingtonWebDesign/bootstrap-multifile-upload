/*
 * multifile-upload v1.2 (https://www.impactmedianc.com/)
 * Copyright Impact Media 2016 Drew Denstedt
 */

var MultiFile = function (el) {

    this.debug = false;
    this.form_id = el;
    this.upload_url = '';
    this.redirect_url = '';
    this.megabyte = 1048576;
    this.max_upload_size = 50; // set a max upload size in megabytes
    this.max_upload_bytes = this.megabyte * this.max_upload_size; // in bytes
    this.files = [];
    this.form = document.getElementById(el);

    if(this.form !== null){

        this.upload_url = this.form.action;
    }
    else{

        this.errorMessage('form');
    }

    this.errorModal();
    this.inputListener();
    this.outputListener();
    this.formListener();    
};

/**
 * set debug mode
 */
MultiFile.prototype.setDebug = function(debug){

    this.debug = debug;
};

/**
 * set custom upload url
 */
MultiFile.prototype.setUploadUrl = function(url){

    this.upload_url = url;
};

/**
 * set custom redirect url
 */
MultiFile.prototype.setRedirectUrl = function(url){

    this.redirect_url = url;
};


/**
 * set form inputs using multifile
 */
MultiFile.prototype.setInput = function(el){
    
    var input = document.getElementById(el);

    if(input !== null){

        this.files[el] = [];
    }
    else{

        this.errorMessage('input');
    }
};

/**
 * make sure no duplicate files are added to the input bundle
 */
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

/**
 * append file attached output to input
 */
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

/**
 * create error modal
 * append to document body
 */
MultiFile.prototype.errorModal = function(){

    var docFrag = document.createDocumentFragment(); 

    var modal = document.createElement('div');
    modal.id = 'multifile-error-modal';
    modal.classList.add('modal', 'fade');
    modal.tabIndex = -1;
    modal.role = 'dialog';

    var modal_dialog = document.createElement('div');
    modal_dialog.className = 'modal-dialog';
    modal_dialog.role = 'document';

    var modal_content = document.createElement('div');
    modal_content.className = 'modal-content';

    var modal_header = document.createElement('div');
    modal_header.className = 'modal-header';


    var h4 = document.createElement('h4');
    h4.classList.add('modal-title', 'text-danger');
    h4.textContent = 'Error';

    var modal_body = document.createElement('div');
    modal_body.className = 'modal-body';

    var p = document.createElement('p');
    p.textContent = 'Total attached files are greater than the max file size. Please reduce attached file size to under ' + this.max_upload_size + 'mb';

    var modal_footer = document.createElement('div');
    modal_footer.className = 'modal-footer';

    var button_close = document.createElement('button');
    button_close.type = 'button';
    button_close.classList.add('btn', 'btn-danger');
    button_close.dataset.dismiss = 'modal';
    button_close.textContent = 'Close';

    // header
    modal_header.appendChild(h4);

    // body
    modal_body.appendChild(p);

    // footer
    modal_footer.appendChild(button_close);

    // modal content
    modal_content.appendChild(modal_header);
    modal_content.appendChild(modal_body);
    modal_content.appendChild(modal_footer);

    // modal dialog
    modal_dialog.appendChild(modal_content);

    // modal
    modal.appendChild(modal_dialog);

    // add modal to docfrag
    docFrag.appendChild(modal);

    // append docfrag to body
    document.body.appendChild(docFrag);
};

/**
 * attach multifile input listener
 * change listner
 */
MultiFile.prototype.inputListener = function (){

    var self = this;

    document.addEventListener('change', function(e){

        if (e.target && e.target.classList.contains('multifile')){

            self.compareFiles(document.getElementById(e.target.id));
        }

    });
};

/**
 * attach listner for multifile removal
 * mouseup listner
 */
MultiFile.prototype.outputListener = function (){

    var self = this;

    document.addEventListener('mouseup', function(e){

        if(e.target && e.target.classList.contains('multifile-remove')){

            self.files[e.target.dataset.multifile_id].splice([Number(e.target.dataset.multifile)], 1);

            self.updateOutput(document.getElementById(e.target.dataset.multifile_id));
        }
    });
};

/**
 * attach form submission listner
 * submit listner
 */
MultiFile.prototype.formListener = function(){

    var self = this;
    
    this.form.addEventListener('submit', function(e){
        
        e.preventDefault();

        var fd = new FormData();   

        var form_upload_size = 0; 

        for(var key in self.files){

            for (var i = 0; i < self.files[key].length; i++) {

                fd.append(key+'[]', self.files[key][i]);
                form_upload_size += self.files[key][i].size;
            }
        }

        if(form_upload_size < self.max_upload_bytes){

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
        }
        else{

            $('#multifile-error-modal').modal('show');
        }

    });
};

/**
 * create some debug logging messages
 */
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
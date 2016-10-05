# bootstrap-multifile-upload
A simple bootstrap multifile upload solution to add to forms. This simple library allows developers to easily integrate multiple multifile inputs to forms and allows users to individually add and remove files from a form input. The form submission builds a FormData object that attaches all multifile input data as well as the remaining form data and posts that submission via ajax. A simple php page to echo the form submission is provided in the package but leaves proper submission handling with any backend code up to developers to implement.

####A simple demo
To view a simple demonstration of functionality you can download the project and run demo.html as provided. In order to successfully log the post submission the project requires php. To test this locally on windows machines run via xampp.

####How to implement
In order to implement into an existing project include `multifile-upload.min.js` and  `multifile-upload.css` within the project.

#####HTML
```html
<div class="multifile-input">
    <label class="btn btn-default btn-file">
        Choose Files
        <input class="multifile" id="files" multiple="" name="files[]" style="display: none;" type="file">
        </input>
    </label>
    <output>
        No Files Choosen
    </output>
</div>
```

#####JS
```javascript
var multifile = new MultiFile('multifile-form');
multifile.setInput('files');
```

#####Options
```javascript
// The default upload location is form action value. To set upload location via js use setUploadUrl
multifile.setUploadUrl('upload.php');

// The default url after submission is the current page. To set redirect url use setRedirectUrl
multifile.setRedirectUrl('submitted.php');

// To bypass window.location.replace after submission and simply log submission results use setDebug(true)
multifile.setDebug(true);
```
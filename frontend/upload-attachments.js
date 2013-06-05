"use strict";

var __ = require("./translate");

(function ($, app) {
    if (app.pageDeleted) return;
    if ($(".drop-here").length == 0) return;

    $(function () {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            return $('.drop-here').hide();
        }

        // Setup the dnd listeners.
        new app.Dropzone({
            element: document.getElementById('drop-zone'),
            handleFileSelect: handleFileSelect
        });
    });

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        $("body").trigger("save");

        uploadFiles(document.location.href, evt.dataTransfer.files);
    }

    function uploadFiles(url, files) {
        var formData = new FormData();

        for (var i = 0, file; file = files[i]; ++i) {
            formData.append("attachments", file);
        }

        var xhr = new XMLHttpRequest();
        var finished = false;
        xhr.open('POST', "/attachments", true);
        xhr.onload = function (e) {
            if (!finished && xhr.status == 200) {
                finished = true;
                handleResponse(xhr.responseText);
                $.message("success", __("successfully-uploaded"));
            }

            app.handleErrors(xhr);
        };


        var progressBar = new app.ProgressBar('#attachments', xhr.upload);

        xhr.send(formData); // multipart/form-data
    }

    var handleResponse = function (res) {
        var response = JSON.parse(res);
        response.attachments.forEach(function (attachment) {
            $('#attachments').append("<li><a href='/attachments/" + response.pageId + "/" + attachment + "' title='" + attachment + "'><i class='icon-file'></i>" + attachment + "</a><a href='#' class='icon-remove-sign'</li>");
        });
        $("h1:first").data().lastModified = response.lastModified;
    };
}(jQuery, app));

// TODO-ENHANCE make this support deleting from middle of string id:25

function DynaType() {
    this.elements = null;
    this.dateSeparator = "/";
    this.dateFormat = "MM/DD/YYYY";
    this.validateSubmit = true;
    this.whileTyping = ["phone", "ssn", "date"];

    return this;
}

// scans DOM for DynaType elements and adds handlers
DynaType.prototype.scan = function() {
    var elements = document.querySelectorAll("[dynatype]");
    var forms = document.querySelectorAll("form.dynatype")

    for (var i = 0; i < elements.length; i++) {
        if (this.whileTyping.includes(elements[i].attributes.dynatype.value)) {
            elements[i].addEventListener("input", this.parseInput.bind(this));
        }
    }

    for (var i = 0; i < forms.length && this.validateSubmit; i++) {
        forms[i].addEventListener("submit", this.validate.bind(this));
    }
}

// sets objects date formating properties
DynaType.prototype.formatDate = function(dateSeparator, dateFormat) {
    this.dateSeparator = dateSeparator;
    this.dateFormat = dateFormat;
}

// on input handler
DynaType.prototype.parseInput = function(e) {
    var type = e.srcElement.attributes.dynatype.value;
    var value = e.srcElement.value, n

    switch(type) {
        case "ssn":
            n = this.stepSSN(e.srcElement);
            break;
        case "date":
            n = this.stepDate(e.srcElement);
            break;
        case "phone":
            n = this.stepPhone(e.srcElement);
            break;
        default:
            console.log("Whoops, this element doesn't have a valid dynatype attribute set!");
            break;
    }

    if (n != null) {
        e.srcElement.value = n[0];
        e.srcElement.setAttribute("dynatype-true", n[1]);
    }
}

// steps
DynaType.prototype.stepSSN = function(element) {
    var val = element.value;
    var test = val.replace(new RegExp(/[^0-9]/, "g"), "").substr(0, 9);

    if (test.length > 3) {
        val = test.substr(0, 3) + "-" + test.substr(3);
    } else {
        val = test.substr(0, 3);
    }

    if (test.length > 5) {
        val = val.substr(0, 6) + "-" + test.substr(5);
    }

    return [val, test];
}

DynaType.prototype.stepDate = function(element) {
    var val = element.value;
    var date = this.dateFormat.split(this.dateSeparator);
    var test = val.replace(new RegExp(/[^0-9]/, "g"), "").substr(0, date[0].length + date[1].length + date[2].length);

    if (test.length > date[0].length) {
        val = test.substr(0, date[0].length) + this.dateSeparator + test.substr(date[0].length);
    } else {
        val = test.substr(0, date[0].length)
    }

    if (test.length > date[0].length + date[1].length) {
        val = val.substr(0, date[0].length + date[1].length + 1) + this.dateSeparator + val.substr(date[0].length + date[1].length + 1);
    }

    return [val, test];
}

DynaType.prototype.stepPhone = function(element) {

    // TODO-ENHANCE support 1 (800) numbers? id:23
    var val = element.value;
    var date = this.dateFormat.split(this.dateSeparator);
    var test = val.replace(new RegExp(/[^0-9]/, "g"), "");

    if (test.length > 3) {
        val = "(" + test.substr(0, 3) + ") " + test.substr(3);
    } else {
        val = test.substr(0, 3);
    }

    if (test.length > 6) {
        val = val.substr(0, 9) + "-" + test.substr(6);
    }

    return [val, test];
}

// parent validate
DynaType.prototype.validate = function(event) {
    var valid = true;
    var elementsInForm = document.querySelectorAll("[dynatype]", this);

    for (var i = 0; i < elementsInForm.length; i++) {
        var e = elementsInForm[i];

        if (e.attributes.dynatype.value == "email") valid = this.isEmail(e.value, true);

        if (!valid) {
            event.preventDefault();
            this.goToElement(e, true);
            return;
        }
    }
}

// returns true if parameter is a valid email
DynaType.prototype.isEmail = function(email, allowEmpty) {
    if (allowEmpty)
        return email == "" || email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
    return email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
}

// scrolls to element and adds class error if error parameter is true
// WARNING THIS FUNCTION REQUIRES JQUERY!
DynaType.prototype.goToElement = function(element, error) {
    console.log(jQuery);
    $("body, html").animate({scrollTop: element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 200}, 450);
    if (error) {
        $(element).addClass("error").focus().select();
    }

    setTimeout(function() {
        $(element).removeClass("error")
    }, 3450);
}

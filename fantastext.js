function FantasText() {
    this.elements = null;
    this.dateSeparator = "/";
    this.dateFormat = "MM/DD/YYYY";
    this.validateSubmit = true;
    this.whileTyping = ["phone", "ssn", "date"];

    return this;
}

// scans DOM for FantasText elements and adds handlers
FantasText.prototype.scan = function() {
    var elements = document.querySelectorAll("[fantastext]");
    var forms = document.querySelectorAll("form.fantastext")

    for (var i = 0; i < elements.length; i++) {
        if (this.whileTyping.includes(elements[i].attributes.fantastext.value)) {
            elements[i].addEventListener("input", this.parseInput.bind(this));
        }
    }

    for (var i = 0; i < forms.length && this.validateSubmit; i++) {
        forms[i].addEventListener("submit", this.validate.bind(this));
    }
}

// sets objects date formating properties
FantasText.prototype.formatDate = function(dateSeparator, dateFormat) {
    this.dateSeparator = dateSeparator;
    this.dateFormat = dateFormat;
}

// on input handler
FantasText.prototype.parseInput = function(e) {
    var type = e.srcElement.attributes.fantastext.value;
    var value = e.srcElement.value, n, pos = (e.srcElement.selectionStart == e.srcElement.selectionEnd) ? e.srcElement.selectionStart : null;

    switch(type) {
        case "ssn":
            n = this.stepSSN(e.srcElement, pos);
            break;
        case "date":
            n = this.stepDate(e.srcElement, pos);
            break;
        case "phone":
            n = this.stepPhone(e.srcElement, pos);
            break;
        default:
            console.log("Whoops, this element doesn't have a valid fantastext attribute set!");
            break;
    }


    if (n != null) {
        e.srcElement.value = n[0]; // sets input value
        e.srcElement.setAttribute("fantastextvalue", n[1]); // sets attribute fantastextvalue to the test string, IE unformatted
        e.srcElement.setSelectionRange(n[2], n[2]); // sets cursor to correct position
    }
}

// steps
FantasText.prototype.stepSSN = function(element, pos) {
    var val = element.value;
    var actual = (element.attributes.fantastextvalue != undefined) ? element.attributes.fantastextvalue.value : undefined;
    var test = val.replace(new RegExp(/[^0-9]/, "g"), "").substring(0, 9);
    var originalVal = val;

    var direction = (actual == undefined || actual.length < test.length) ? 1 : -1;

    if (test.length > 3) {
        val = test.substring(0, 3) + "-" + test.substring(3);
    } else {
        val = test.substring(0, 3);
    }

    if (test.length > 5) {
        val = val.substring(0, 6) + "-" + test.substring(5);
    }

    pos = getNewPosition(val, originalVal, test, pos, direction);

    return [val, test, pos];
}

FantasText.prototype.stepDate = function(element, pos) {
    var val = element.value;
    var actual = (element.attributes.fantastextvalue != undefined) ? element.attributes.fantastextvalue.value : undefined;
    var date = this.dateFormat.split(this.dateSeparator);
    var test = val.replace(new RegExp(/[^0-9]/, "g"), "").substring(0, date[0].length + date[1].length + date[2].length);
    var originalVal = val;

    var direction = (actual == undefined || actual.length < test.length) ? 1 : -1;

    if (test.length > date[0].length) {
        val = test.substring(0, date[0].length) + this.dateSeparator + test.substring(date[0].length);
    } else {
        val = test.substring(0, date[0].length)
    }

    if (test.length > date[0].length + date[1].length) {
        val = val.substring(0, date[0].length + date[1].length + 1) + this.dateSeparator + val.substring(date[0].length + date[1].length + 1);
    }

    pos = getNewPosition(val, originalVal, test, pos, direction);

    return [val, test, pos];
}

FantasText.prototype.stepPhone = function(element, pos) {
    var val = element.value;
    var actual = (element.attributes.fantastextvalue != undefined) ? element.attributes.fantastextvalue.value : undefined;
    var test = val.replace(new RegExp(/[^0-9]/, "g"), "");
    var originalVal = val;

    var direction = (actual == undefined || actual.length < test.length) ? 1 : -1;

    if (test.length > 7) {
        if (test.charAt(0) == "1") val = "1 (" + test.substring(1, 4) + ") " + test.substring(4, 7) + "-" + test.substring(7);
        else val = "(" + test.substring(0, 3) + ") " + test.substring(3, 6) + "-" + test.substring(6);
    } else if (test.length > 3) {
        if (test.charAt(0) == "1") val = "1 (" + test.substring(1, 4) + ") " + test.substring(4);
        else val = "(" + test.substring(0, 3) + ") " + test.substring(3);
    }
    else  val = test;

    pos = getNewPosition(val, originalVal, test, pos, direction);

    return [val, test, pos];
}

// parent validate
FantasText.prototype.validate = function(event) {
    var valid = true;
    var elementsInForm = event.srcElement.children;

    for (var i = 0; i < elementsInForm.length; i++) {
        var e = elementsInForm[i];

        if (e.hasAttribute("fantastext")) {
            if (e.attributes.fantastext.value == "email") valid = this.isEmail(e.value, true);

            if (!valid) {
                event.preventDefault();
                var body = document.getElementsByTagName("body")[0];
                var event = new CustomEvent("fantastext-validate-error", {"detail": e});
                body.dispatchEvent(event);
                return;
            }
        }
    }
}

// returns true if parameter is a valid email
FantasText.prototype.isEmail = function(email, allowEmpty) {
    if (allowEmpty)
        return email == "" || email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
    return email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
}

// returns the distance to the next valid character (IE not something added by the plugin like a '-' or a '(')
function findNextCharacterDistance(val, test, index, direction) {
    if (direction > 0) {
        // we're adding
        for (i = index; i < val.length; i++) if (test.indexOf(val.charAt(i - 1)) >= 0) return i - index;
        return -1;
    } else if (direction < 0) {
        // we're deleting
        for (i = index; i > 0; i--) if (test.indexOf(val.charAt(i - 1)) >= 0) return index - i;
        return -1;
    }
}

// returns new start/end positions for cursor
function getNewPosition(val, originalVal, test, pos, direction) {
    // we've backspaced
    if (direction < 0) {
        if (pos < originalVal.length) {
            // not deleting from end
            // if the character at the position we've selected isn't in the test string (IE a '-' or a ' ')
            pos -= findNextCharacterDistance(val, test, pos, direction);
        }
    } else if (direction > 0) {
        // we've added
        if (pos < originalVal.length) {
            // not adding to end
            // if the character at the position we've selected isn't in the test string (IE a '-' or a ' ')
            pos += findNextCharacterDistance(val, test, pos, direction);
        } else {
            pos = val.length;
        }
    }

    return pos;
}

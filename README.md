# FantasText
A lightweight, vanilla Javascript plugin for formatting text in text boxes as it's typed.

# How it works
FantasText scans your DOM for forms with the ```fantastext``` class, and will validate each tagged input as the user types. It will also validate emails when the form is submitted. It maintains the cursor position correctly throughout and avoids any characters added by the plugin.

# How to use
Import the fantastext.js file into your HTML.

In your javascript, initialize the plugin:
```Javascript
var fantastext = new FantasText();
fantastext.scan();
```

In your HTML, add the class ```fantastext``` to any forms you want validated, and the ```fantastext``` attribute to any inputs you want the plugin to change:
```html
<form class="fantastext">
  <input fantastext="ssn" type="text" placeholder="Social Security #" />
  <input fantastext="date" type="text" placeholder="Date of Birth" />
  <input fantastext="phone" type="text" placeholder="Phone Number" />
  <input fantastext="email" type="text" placeholder="Email Address" />
</form>
```

Currently supported values for FantasText:
- "phone" (phone numbers, formatted as '(aaa) aaa-aaaa')
- "date" (Dates, default format is 'MM/DD/YYYY')
- "ssn" (Social security numbers, formatted as 'aaa-aa-aaaa')
- "email" (Emails, validated on form submit)

# Changing date format
The first argument here is the separator character, the second is the total format of the date.
```javascript
fantastext.formatDate("-", "MM-DD-YYYY");
```
Disclaimer, this function only changes the separator, the overall format doesn't change.

# Emails

Emails aren't validate while typing, but rather on form submit. FantasText is configured to allow each form to submit with each contained email field either empty or with a valid email address. It only prevents the submission if the form contains an email field that isn't empty and doesn't contain an email address.

When FantasText prevents form submission, it triggers an event on the body called ```fantastext-validate-error```. This event has a ```detail``` parameter that contains the element (input) that failed validation.

Here is an example of using this event in your own scripts. This is jQuery; it listens for the event on the body, adds the class ```error``` to the problem element, and then scrolls to it.
```javascript
$("body").on("fantastext-validate-error", function(e) {
    $(e.detail).addClass("error");
    $("html, body").animate({scrollTop: $(e.detail).offset().top - 200}, 400);
})
```

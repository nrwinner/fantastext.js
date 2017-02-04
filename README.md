# FantasText
A lightweight, vanilla Javascript plugin for formatting text in text boxes as it's typed.

# How it works
Import the fantastext.js file into your HTML. Initialize the fantastext object like:

```Javascript
var fantastext = new FantasText();
```

Any forms you want the plugin to scan, intialize as so:

```html
<form class="fantastext">
  <input fantastext="ssn" type="text" placeholder="Social Security #" />
  <input fantastext="date" type="text" placeholder="Date of Birth" />
  <input fantastext="phone" type="text" placeholder="Phone Number" />
  <input fantastext="email" type="text" placeholder="Email Address" />
</form>
```

Scan the DOM for FantasText objects with

```javascript
fantastext.scan();
```

Emails aren't validate while typing, but rather on form submit.

Currently supported values for fantastext:
- "phone" (phone numbers, formatted as '(aaa) aaa-aaaa')
- "date" (Dates, default format is 'MM/DD/YYYY')
- "ssn" (Social security numbers, formatted as 'aaa-aa-aaaa')
- "email" (Emails, validated on form submit)

Changing date format
```javascript
fantastext.formatDate("-", "MM-DD-YYYY");
```

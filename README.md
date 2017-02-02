# DynaType
A lightweight, vanilla Javascript plugin for formatting text in text boxes as it's typed.

# How it works
Import the dynatype.js file into your HTML. Initialize the dynatype object like:

```Javascript
var dynatype = new DynaType();
```

Any forms you want the plugin to scan, intialize as so:

```html
<form class="dynatype">
  <input dynatype="ssn" type="text" placeholder="Social Security #" />
  <input dynatype="date" type="text" placeholder="Date of Birth" />
  <input dynatype="phone" type="text" placeholder="Phone Number" />
  <input dynatype="email" type="text" placeholder="Email Address" />
</form>
```
Emails aren't validate while typing, but rather on form submit.

Currently supported values for dynatype:
- "phone" (phone numbers, formatted as '(aaa) aaa-aaaa')
- "date" (Dates, default format is 'MM/DD/YYYY')
- "ssn" (Social security numbers, formatted as 'aaa-aa-aaaa')
- "email" (Emails, validated on form submit)

Changing date format
```javascript
dynatype.formatDate("-", "MM-DD-YYYY");
```


# Cons
* The goToElement function DOES REQUIRE JQUERY (sorry I'm terribly with JavaScript animation)

# Implementation details

## Page numbering

* Created a page number variable called `currentPage` and set its value to 1
* Accessed the `next` and `previous` buttons and assigned them to variables called `nextBtn` and `previousBtn`
* Added an `click` event listener to the `nextBtn` and `previousBtn` variables and added an event handler to each button that increments or decrements the `currentPage` variable by 1



## API Request

* Created a function called `loadData` that takes a parameter called `page` which is number corresponding to the `currentPage` value at a given time.
* In the `loadData` function I created a `fetch` request to the `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${`page`}` endpoint and assigned the response to a variable called `response`.
* For a `response` with status code `200`, I used the `json` method to parse the response into a JavaScript object and assigned the result to a variable called `resData`.
* The `resData` variable is then used to access the `results` property of the object. The `results` property is an array of objects containing the data for each page `N and N+1` and a paging property. The paging property contains a `next` and `previous` property.
* Using the angle bracket notation I am able to access the first item in the data object by passing in the currentPage value. This is then assigned to a variable called `data`.

* Using the page value from an info property in `resData` I update the `textContent` of the `pageView`. `pageView` is a label element that shows page number.
* If we have a `previous` property in paging I disable the `previousBtn` element by setting `disabled` to true and false if otherwise.
* Using the querySelectorAll method I select all the table row element. This returns a NodeList of all the elements that match the selector.
* Using a for-in loop I iterate through the `data` array and and set a `data-entryid` attribute with dataItem id as the value to each table row element on the HTML table body.
* Lastly I access each child element in the table row and set the `textContent` of each element to the value of the corresponding property in the data object.


## How does this work

* On page load data is pulled from the API for the first page and displayed on the page.
* More data can be fetched by clicking the `next` button. And to load previous data the `previous` button is used.
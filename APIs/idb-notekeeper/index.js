const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

// Create an instance of a db obj to store the open db in
// This is the db
let db; 

window.onload = function () {
	// Open the db; it is created id it doesnt already exist
	// (using onupgradeneeded)
	let request = window.indexedDB.open('notes_db', 1);

	// onerror meansthe db didnt open
	request.onerror = function () {
		console.log('DB failed to open');
	};

	// onsuccess means db opened successfully
	request.onsuccess = function () {
		console.log('DB opened successfully');

		// Store the opened db obj in the db var
		db = request.result;

		// Run this func to display the notes already in IDB
		displayData();
	};

	request.onupgradeneeded = function (e) {
		// Grab a reference to the opened db
		let db = e.target.result;

		// Create an Obj to store notes in
		// (basically like a single table)
		// including a auto-incrementing key
		let objectStore = db.createObjectStore('notes_os', { keyPath: 'id', autoIncrement: true });

		// Define what data items the objstore will contain
		objectStore.createIndex('title', 'title', { unique: false });
		objectStore.createIndex('body', 'body', { unique: false });
		console.log('DB setup complete');
	};

	form.onsubmit = addData;

	function addData(e) {
		e.preventDefault();

		// Grab values entered into the form fields and 
		// store them in an obj ready for being inserted into the DB
		let newItem = { title: titleInput.value, body: bodyInput.value };

		// Open a read/write db transaction, ready for adding the data
		let transaction = db.transaction(['notes_os'], 'readwrite');

		// call an obj store that's already been added to the DB
		let objectStore = transaction.objectStore('notes_os');

		// Make a request to add the newItem to the store
		var request = objectStore.add(newItem);
		request.onsuccess = function () {
			// Clear the form, ready for adding the next entry
			titleInput.value = '';
			bodyInput.value = '';
		};

		// Report on the success of the transaction completing
		// when everythinh is done

		transaction.oncomplete = function () {
			console.log('Transaction completed: db modification fiished.');

			//update the display of data to show the new added item
			displayData();
		};

		transaction.onerror = function () {
			console.log('transaction not opened due to error');
		};
	}

		// Define displayData() function
		function displayData() {
			// Here we empty the contents of the list element each time the display is updated
			// If you didn't do this, you'd get duplicates listed each time a new note is added
			while (list.firstChild) {
				list.removeChild(list.firstChild);
			}

			// Open out store andthen get a cursor - which iterates through all the different data items in the store
			let objectStore = db.transaction('notes_os').objectStore('notes_os');
			objectStore.openCursor().onsuccess = function (e) {
				// Get a reference to the cursor
				let cursor = e.target.result;

				// If there is still another data item to iterate through, keep running this code
				if (cursor) {
					// Create a lst item, h3, and p to put each data itekm inside when displaying it
					// structure the HTML fragment, and append it inside the list
					const listItem = document.createElement('li');
					const h3 = document.createElement('h3');
					const p = document.createElement('p');

					listItem.appendChild(h3);
					listItem.appendChild(p);
					list.appendChild(listItem);

					// Put the data from the cursor inside the h3 and p
					h3.textContent = cursor.value.title;
					p.textContent = cursor.value.body;

					// Store the ID of the data item inside an attribute on the listItem, so we know
					// which item it corresponds to, This will be useful later when we want to delete items
					listItem.setAttribute('data-note-id', cursor.value.id);

					// Create a button and place it inside each listItem
					const deleteBtn = document.createElement('button');
					listItem.appendChild(deleteBtn);
					deleteBtn.textContent = 'Delete';

					// Set event handler so that when the button is clicked, the deleteItem function is run
					deleteBtn.onclick = deleteItem;

					// Iterate to the next item in the cursor
					cursor.continue();
				} else {
					// if list is empty, display a "No notes stored" message
					if(!list.firstChild) {
						const listItem = document.createElement('li');
						listItem.textContent = 'No notes stored.';
						list.appendChild(listItem);
					}
					// If there are no more cursor items to iterate through, say so
					console.log('All notes are displayed');
				}
			};
		}
		
		function deleteItem(e) {
			// retrieve the name of the task we want to delete
			// We need to convert it to a number before trying it use it with IDB; IDB key values are type-sensitive.
			let noteId = Number(e.target.parentNode.getAttribute('data-note-id'));

			// open a db transaction and delete the task, finding it using the id we retrieve above
			let transaction = db.transaction(['notes_os'], readwrite);
			let objectStore = transaction.objectStore('notes-os');
			let request = objectStore.delete(noteId);

			// report that the data item has been deleted
			transaction.oncomplete = function () {
				// delete the parent of the button
				// which is the list item, so is no longer displayed
				e.target.parentNode.parentNode.removeChild(e.target.parentNode);
				console.log('Note ' + noteId + ' deleted');

				// if the list item is empty, display a "No notes stored" message
				if (!list.firstChild) {
					const listItem = document.createElement('li');
					listItem.textContent = 'No notes stored.';
					list.appendChild(listItem);
				}
			}
		}
}

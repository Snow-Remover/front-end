let $ = require('jquery')
let fs = require('fs')
let filename = 'locations.csv'

$('#refresh').on('click', () => {
   //clear table
   clearEntries()
   loadAndDisplayContacts()
})

function addEntry(posx, posy) {
   if(posx && posy) {
      let updateString = '<tr><td>'+ posx +'</td><td>' + posy +'</td></tr>'
      $('#location-table tbody').append(updateString)
   }
}

function clearEntries() {
  $('#location-table tbody tr').remove();
}

function loadAndDisplayContacts() {

   //Check if file exists
   if(fs.existsSync(filename)) {
      let data = fs.readFileSync(filename, 'utf8').split('\n')

      data.forEach((location, index) => {
         let [ posx, posy ] = location.split(',')
         addEntry(posx, posy)
      })

   } else {
      console.log("File Doesn\'t Exist. Creating new file.")
      fs.writeFile(filename, '', (err) => {
         if(err)
            console.log(err)
      })
   }
}

loadAndDisplayContacts()

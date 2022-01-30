var botDataDict = {};
var allowDataGeneration = false

Element.prototype.insertChildAtIndex = function(child, index) {
  if (!index) index = 0
  if (index >= this.children.length) {
    this.appendChild(child)
  } else {
    this.insertBefore(child, this.children[index])
  }
}

function loadBotData() {
    $.ajax({
        type: 'GET',
        url: "https://qm6z7raeic.execute-api.us-west-1.amazonaws.com/prod/admin",
        
        success: (data) => {
            for (let botData of data.data) {
                createBotRow(botData);
            }
            
            if (!allowDataGeneration) {
                updateAdminPage();
            }
        }
    });
}

function createBotRow(data) {
    let id = data.botId;
    // create table row
    let dataRow = document.createElement('tr');
    dataRow.classList.add('data-row');
    
    // controls
    let controlBox = document.getElementById('control-template');
    let newBox = controlBox.content.cloneNode(true);
    $(newBox).find('.id-field')[0].textContent = `${id}`;
    
    dataRow.appendChild(newBox);
    
    // Distance
    dataRow.innerHTML += `\n<td class="distance table-cell"><p>${data.distanceA}<br>${data.distanceB}</p></td>`;
    
    // Light
    dataRow.innerHTML += `\n<td class="light table-cell"><p>${data.lightA}<br>${data.lightB}</p></td>`;
    
    // Voltage
    dataRow.innerHTML += `\n<td class="voltage table-cell"><p>${data.voltageA}<br>${data.voltageB}</p></td>`;
    
    // Energy
    dataRow.innerHTML += `\n<td class="energy table-cell"><p>${data.energy}</p></td>`;

    botDataDict[id] = dataRow;
    document.getElementById('bot_info_container').appendChild(dataRow);
    
    $('.ctrl-up-all').slice(-1).mouseup(() => {
        moveTop(id);
    });
    $('.ctrl-up').slice(-1).mouseup(() => {
        moveUp(id);
    });
    $('.ctrl-dn').slice(-1).mouseup(() => {
        moveDown(id);
    });
    $('.ctrl-dn-all').slice(-1).mouseup(() => {
        moveBottom(id);
    });
}

function findById(parent, id) {
    return [...(parent.children)].find(child => child.id == id);
}

function findByClass(parent, cls) {
    return [...(parent.children)].find(child => child.classList.contains(cls));
}

function moveTop(id) {
    let row = botDataDict[id];
    
    let parent = row.parentNode;
    
    row.remove();
    parent.insertBefore(row, $('.data-row')[0]);
}

function moveUp(id) {
    let row = botDataDict[id];
    
    let parent = row.parentNode;
    let prevList = $(row).prevAll();
    let newRow = botDataDict[id] = $(row).clone(true, true)[0];
    parent.insertBefore(newRow, prevList.length > 2 ? prevList[0]: $('.data-row')[1]);
    botDataDict[id] = newRow;
    row.remove();
}

function moveDown(id) {
    let row = botDataDict[id];
    
    let parent = row.parentNode;
    let nextList = $(row).nextAll();
    
    let newRow = botDataDict[id] = $(row).clone(true, true)[0];
    if (nextList.length > 1) {
        parent.insertBefore(newRow, nextList[1]);
    } else {
        parent.appendChild(newRow);
    }
    botDataDict[id] = newRow;
    row.remove();
}

function moveBottom(id) {
    let row = botDataDict[id];
    
    let parent = row.parentNode;
    
    row.remove();
    parent.appendChild(row);
}

//Rests data and energy of ALL bots (admin view)
function resetBotData() {
   $.ajax({
        type: 'PUT',
        url: "https://qm6z7raeic.execute-api.us-west-1.amazonaws.com/prod/reset"
   })
}

async function updateAdminPage() {
    allowDataGeneration = true;
    let loop = setInterval( () => {
        $.ajax({
            type: 'GET',
            url: "https://qm6z7raeic.execute-api.us-west-1.amazonaws.com/prod/admin",
            async: false,
            success: function(data){
                let statusCode = data["statusCode"];
                if(statusCode === 200){
                    for (let botData of data['data']) {
                        let id = botData['botId'];
                        
                        let row = botDataDict[id];
                        
                        $(row).find('.distance').innerHTML = `<p>${data.distanceA}<br>${data.distanceB}</p>`;
                        $(row).find('.light').innerHTML = `<p>${data.lightA}<br>${data.lightB}</p>`;
                        $(row).find('.voltage').innerHTML = `<p>${data.voltageA}<br>${data.voltageB}</p>`;
                        $(row).find('.energy').innerHTML = `<p>${data.energy}</p>`;
                    }
                }
            }
        })
    }, 300);
}
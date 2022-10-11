// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
//this with that crhome.tabs.query does some magic it should select the active and currentWindow..ok
//but that tab is somehow conncted to that target object but not used at all, lets first see if there is any 
//tab and tabID and how this can then change in setPageBackground the color...
//we always need to reinstall that extention it cant be executet
changeColor.addEventListener("click", async() => {
    console.log("Click event triggered");

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log.apply("Tab found" + tab.id);

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
        console.log('Maryline changed the color to ' + color); //this never appears or?no
        document.body.style.backgroundColor = color; // we leave that with the color so we see that its activated
        //but here now we register a mouselistener to the document or body i dont know
        const noneOnce = {
            once: false
        };
        //was a scope problem inline it works now i want some proper properties or methods that can be called from that event
        //ok hate there inconsitency with the names but maybe target is better than relatedTarget lol
        document.addEventListener('click', function(event) {
            console.log('Mouse click captured ' + event.pageX + ' ' + event.pageY);
            //i thought related target does the show and i think it dosnt need to be reloaded!
            //this is the problem...  Cannot read properties of null (reading 'tagName')ok page x and y work fine..
            console.log('-> Related Target ' + event.target.nodeName); //on our page we dont use an id
            console.log('--> Related Target id' + event.target.id); //on our page we dont use an id


        }, noneOnce); //this might be not able to access that handlemouse thing
        //it might have to do with it that the code handleMouseEvents is not on the same page as the eventListener

    });
}
//o wrong handler damnit
function handleMouseEvents(event) {
    //alert('outer, none-once, default'); alert is lame
    console.log('Mouse click captured ' + event); // its eighter source or target or something; shall we try?yeah
}

var collectedData = {};

// function for retrieving pokemon stats
async function getData(category, name) 
{
    formattedName = name.toLowerCase().trim();
    let url = "https://pokeapi.co/api/v2/" + category + "/" + formattedName;
    try 
    {
        let res = await fetch(url);
        let pokemon = await res.json();
        return pokemon;
    } catch (error)
    {
        console.log("error finding data");
        // error stuff here
        return 0;
    }
}

// function for optimizing data retrieval
async function bankData(category, id) {
    if (Object.hasOwn(collectedData, category + "/" + id)) {
        var data = collectedData[category + "/" + id];
    } else {
        var data = await getData(category, id);
        collectedData[category + "/" + id] = data;
    }
    return data;
} 
natureValues = {
    "positive" : 1.1,
    "neutral" : 1,
    "negative" : 0.9
}

totalPokemon = 1010;
totalMoves = 902;
totalNatures = 25;
totalItems = 725;
totalFiles = totalPokemon + totalMoves + totalNatures + totalItems;
loaded = false;

// calculate hp total based on base stat, evs, ivs, and level
function HPStatCalc(base, iv, ev, level)
{
    calc1 = (2 * base + iv + Math.floor(ev/4)) * level;
    return Math.floor(calc1/100) + level + 10;
}

// calculate stat based on base stat, evs, ivs, level, and nature
function StatCalc(base, iv, ev, level, nature)
{
    calc1 = (2 * base + iv + Math.floor(ev/4)) * level;
    return Math.floor((Math.floor(calc1/100) + 5) * nature);
}

// calculate damage based on level, base power, atk/def stats, and other multipliers
function DamageCalc(level, power, atk, def, stab, type, other)
{
    calc1 = Math.floor(Math.floor((Math.floor((2 * level)/5) + 2) * power * atk / def)/50 + 2)
    calc1 = mult(calc1, stab);
    calc1 = mult(calc1, type);
    calc1 = mult(calc1, other);
    return calc1;
}

// the function that is called when the button is pressed
async function CalcLowest()
{
    physical = (document.getElementById("moveCategory").value === "physical");
    // target div
    targetLevel   = parseInt(document.getElementById("targetLevel").value);
    targetBaseHP  = parseInt(document.getElementById("targetBaseHP").value);
    targetHPIV    = parseInt(document.getElementById("targetHPIV").value);

    targetBaseDef = (physical ? 
        parseInt(document.getElementById("targetBaseDef").value) :
        parseInt(document.getElementById("targetBaseSpDef").value)
    );
    targetDefIV   = (physical ? 
        parseInt(document.getElementById("targetDefIV").value) :
        parseInt(document.getElementById("targetSpDefIV").value)
    );

    remainingEVs  = parseInt(document.getElementById("remainingEVs").value);
    targetNature  = document.getElementById("targetNatureMenu").value;

    // attacker div
    attackLevel   = parseInt(document.getElementById("attackLevel").value);

    attackBaseAtk = (physical ? 
        parseInt(document.getElementById("attackBaseAtk").value) :
        parseInt(document.getElementById("attackBaseSpAtk").value) 
    );
    attackAtkIV   = (physical ?
        parseInt(document.getElementById("attackAtkIV").value) :
        parseInt(document.getElementById("attackSpAtkIV").value)
    );
    attackAtkEV   = (physical ? 
        parseInt(document.getElementById("attackAtkEV").value) :
        parseInt(document.getElementById("attackAtkEV").value)
    );

    attackNature  = document.getElementById("attackNatureMenu").value;

    // move div
    movePower     = parseInt(document.getElementById("movePower").value);
    STAB          = document.getElementById("STAB").checked;
    typeEffective = Number(document.getElementById("typeEffective").value);
    otherMult     = parseInt(document.getElementById("otherMult").value);

    // handling misc attributes
    targetNature = await natureToValue(targetNature, (physical ? "defense" : "special-defense"));
    attackNature = await natureToValue(attackNature, (physical ? "attack" : "special-attack"));

    STAB = (STAB ? 1.5 : 1);

    if (errorValues())
    {
        document.getElementById("result").innerHTML = "lol";
        document.getElementById("result").style.visibility = "visible";
        return;
    }

    damages = []

    // loop through and calculate each combination of evs
    for (i = 0; i < remainingEVs; i++)
    {
        HP_EV = Math.min(252, i);
        DEF_EV = Math.min(252, remainingEVs - i);

        damages.push(DamageCalc(attackLevel, movePower, 
            StatCalc(attackBaseAtk, attackAtkIV, attackAtkEV, attackLevel, attackNature), 
            StatCalc(targetBaseDef, targetDefIV, DEF_EV, targetLevel, targetNature), 
            STAB, typeEffective, otherMult)/
            HPStatCalc(targetBaseHP, targetHPIV, HP_EV, targetLevel));
    }

    lowest = 1000;
    lowestIndex = -1;

    // find the smallest amount of damage
    for (i = 0; i < damages.length; i++)
    {
        if (damages[i] < lowest)
        {
            lowest = damages[i];
            lowestIndex = i;
        }
    }
    console.log(lowest);
    lowest = round(lowest * 100, 1);

    //console.log(lowest, lowestIndex);
    document.getElementById("result").innerHTML =
    "In order to take a minimum high roll of <b>" + lowest.toString() + 
    "%</b>, you would need to invest <b>" + Math.min(252, lowestIndex).toString() +
    "</b> EV's into HP, and <b>" + Math.min(252, remainingEVs-lowestIndex).toString() +
    "</b> EV's into " + (physical ? "Defense" : "Special Defense") +". Any set besides this is <b>cowardice</b>."
    document.getElementById("result").style.visibility = "visible";
}

// function for checking if inputted numbers are correct
function errorValues()
{
    values = [
        targetLevel,
        targetBaseHP,
        targetHPIV,
        targetBaseDef,
        targetDefIV,
        remainingEVs,
        targetNature,

        attackLevel,
        attackBaseAtk,
        attackAtkIV,
        attackAtkEV,
        attackNature,

        movePower,
        STAB,
        typeEffective,
        otherMult,
    ]
    
    for (i = 0; i < values.length; i++)
    {
        if (![6, 11, 13, 14].includes(i)) // if the current index is a number
        {
            if (isNaN(values[i])) // if parsing the value
            {
                return true;
            } 
        }
    }
    return false;
}

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

async function importPokemon(importField, statTypes, statFields, typeFields)
{
    data = await getData("pokemon", document.getElementById(importField).value);
    if (data != 0)
    {
        stats = data["stats"];
        types = data["types"];

        for (i = 0; i < statTypes.length; i++)
        {
            document.getElementById(statFields[i]).value = parseInt(stats[statTypes[i]]["base_stat"]);
        }

        for (i = 0; i < typeFields.length; i++)
        {
            try {
            document.getElementById(typeFields[i]).value = types[i]["type"]["name"];
            } catch (error)
            {
                document.getElementById(typeFields[i]).value = "(none)";
            }
        }
    }
    importMove(['attackType1', 'attackType2'], ['targetType1', 'targetType2'])
}

async function importMove(attackTypes, targetTypes)
{
    data = await getData("move", document.getElementById("importMoveMenu").value);
    if (data != 0)
    {
        
        power = data["power"];
        type = data["type"]["name"];
        category = data["damage_class"]["name"];

        document.getElementById("moveType").value = type;
        document.getElementById("moveCategory").value = category;
        document.getElementById("movePower").value = power;
        document.getElementById("STAB").checked = false;

        try {
            for (i = 0; i < attackTypes.length; i++)
            {
                if (document.getElementById(attackTypes[i]).value == type)
                {
                    document.getElementById("STAB").checked = true;
                    break;
                }
            }
        } 
        catch(error)
        {

        }

        effectiveness = document.getElementById("typeEffective"); 
        data = await getData("type", type);
        damageRelations = data["damage_relations"];

        currentEffective = 1;

        for (i = 0; i < 2; i++)
        {
            currentType = document.getElementById(targetTypes[i]).value;
            for (j = 0; j < damageRelations["double_damage_to"].length; j++)
            {
                if (currentType === damageRelations["double_damage_to"][j]["name"])
                {
                    currentEffective *= 2;
                }
            }
            for (j = 0; j < damageRelations["half_damage_to"].length; j++)
            {
                if (currentType === damageRelations["half_damage_to"][j]["name"])
                {
                    currentEffective *= 0.5;
                }
            }
            for (j = 0; j < damageRelations["no_damage_to"].length; j++)
            {
                if (currentType === damageRelations["no_damage_to"][j]["name"])
                {
                    currentEffective *= 0;
                }
            }
        }

        effectiveness.value = currentEffective.toString();
        
    }
}

window.onload = async function() 
{
    // pokemon -------------------------------------------
    targetMenu = document.getElementById("importTargetMenu");
    attackMenu = document.getElementById("importAttackMenu");

    for (i = 1; i < totalPokemon+1; i++)
    {
        data = await getData("pokemon-species", i.toString());

        for (k = 0; k < data["varieties"].length; k++)
        {
            pokemonName = data["varieties"][k]["pokemon"]["name"];

            if (pokemonViable(pokemonName))
            {
                option = new Option();
                option.value = pokemonName;
                //console.log(pokemonName);
                option.text = titleCase(pokemonName);

                targetMenu.add(option);
            }
        }
        updateProgress(i);
    }
    attackMenu.innerHTML += targetMenu.innerHTML;
    // ---------------------------------------------------

    // moves   -------------------------------------------
    moveMenu = document.getElementById("importMoveMenu");

    for (i = 1; i < totalMoves+1; i++)
    {
        data = await getData("move", i.toString());

        if (data["learned_by_pokemon"].length > 0 && data["damage_class"]["name"] != "status")
        {
            option = new Option();
            option.value = data["name"];
            //console.log(option.value);

            for (j = 0; j < data["names"].length; j++)
            {
                if (data["names"][j]["language"]["name"] === "en")
                {
                    option.text = data["names"][j]["name"];
                    break;
                }
            }

            moveMenu.add(option);
        }
        updateProgress(totalPokemon + i);
    }
    // ---------------------------------------------------

    // natures -------------------------------------------
    targetNatureMenu = document.getElementById("targetNatureMenu");
    attackNatureMenu = document.getElementById("attackNatureMenu");

    for (i = 1; i < totalNatures+1; i++)
    {
        data = await getData("nature", i.toString());

        if (true)
        {
            option = new Option();
            option.value = data["name"];

            for (j = 0; j < data["names"].length; j++)
            {
                if (data["names"][j]["language"]["name"] === "en")
                {
                    option.text = data["names"][j]["name"];
                    break;
                }
            }

            targetNatureMenu.add(option);
        }
        updateProgress(totalPokemon + totalMoves + i);
    }
    attackNatureMenu.innerHTML += targetNatureMenu.innerHTML;

    // ---------------------------------------------------

    // items   -------------------------------------------
    targetItemMenu = document.getElementById("targetItemMenu");
    attackItemMenu = document.getElementById("attackItemMenu");

    for (i = 1; i < totalItems+1; i++)
    {
        try {
            data = await getData("item",  i.toString());

            if (itemViable(data["category"]["name"]))
            {
                option = new Option();
                option.value = data["name"];
                //console.log(option.value, data["category"]["name"]);

                for (j = 0; j < data["names"].length; j++)
                {
                    if (data["names"][j]["language"]["name"] === "en")
                    {
                        option.text = data["names"][j]["name"];
                        break;
                    }
                }
                targetItemMenu.add(option);
            }
        } 
        catch (error)
        {
            //console.log("error finding item")
        }

        updateProgress(totalPokemon + totalMoves + totalNatures + i);
    }
    attackItemMenu.innerHTML += targetItemMenu.innerHTML;
    // ---------------------------------------------------

    for (i = 0; i < document.getElementsByClassName("loading").length; i++)
    {
        document.getElementsByClassName("loading")[i].style.display = "none";
        document.getElementsByClassName("menu")[i].style.display = "block";
    }
    document.getElementById("progressBar").style.display = "none";

    loaded = true;
}

function pokemonViable(name)
{
    suffixes = [
        "-mega", "-gmax", "-x", "-y", "-star", "-belle", "-phd", "-cap", "-libre", "-starter",
        "-primal", "-construct", "-totem", "-tempo", "-build", "-mode", "-plumage", "-roaming", 
        "-three", "-segment", "-cosplay"
    ];
    if (name.includes("totem"))
    {
        return false;
    }
    for (ii = 0; ii < suffixes.length; ii++)
    {
        if (name.endsWith(suffixes[ii]))
        {
            return false;
        }
    }
    return true;
}

function itemViable(category)
{
    categories = [
        "standard-balls", "special-balls", "healing", "status-cures", "revival", "pp-recovery",
        "vitamins", "stat-boosts", "spelunking", "flutes", "evolution", "loot", "collectibles",
        "dex-completion", "mulch", "all-mail", "baking-only", "effort-drop", "effort-training",
        "training", "scarves", "all-machines", "gameplay", "unused", "event-items", "plot-advancement",
        "apricorn-balls", "apricorn-box", "data-cards", "jewels", "miracle-shooter", "mega-stones",
        "memories", "z-crystals", "species-specific", "medicine", "other", "picky-healing", "in-a-pinch"
    ];
    for (ii = 0; ii < categories.length; ii++)
    {
        if (category === categories[ii])
        {
            return false;
        }
    }
    return true;
}

// function for converting natures to the value
async function natureToValue(nature, stat)
{
    data = await getData("nature", nature);
    if (data["increased_stat"] != null)
    {
        if (data["increased_stat"]["name"] === stat)
        {
            return 1.1;
        }
    }
    if (data["decreased_stat"] != null)
    {
        if (data["decreased_stat"]["name"] === stat)
        {
            return 0.9;
        }
    }
    return 1;
}

// function for updating the progress bar
function updateProgress(prog)
{
    fraction = prog/totalFiles;
    document.getElementById("progress").style.width = (fraction*100).toString() + "%";
}

// function for adjusting the input fields
function limitValue(input)
{
    const minValue = parseInt(input.min);
    const roundedValue = Math.round(input.value);
    const newValue = roundedValue < minValue ? minValue : roundedValue;
    input.value = newValue;
}

// function for displaying the modifiers tab
function showModifiers()
{
    mods = document.getElementsByClassName("modifier-details")[0];
    mods.style.display = (mods.style.display == "none" ? "block" : "none");
}

// rounded multiplication
function mult(a, b)
{
    result = a * b;
    result = (result - Math.floor(result) == 0.5 ? Math.floor(result) : Math.round(result));
    return result;
}

// round function
function round(n, digits)
{
    tens = Math.pow(10, digits)
    return Math.floor(tens * n)/tens
}

// titlecase function 
function titleCase(str) {
    newName = str.charAt(0).toUpperCase();
    for (j = 0; j < str.length-1; j++)
    {
        if (str.charAt(j) === " " || str.charAt(j) === "-") 
        {
            newName += str.charAt(j+1).toUpperCase();
        } 
        else
        {
            newName += str.charAt(j+1)
        }
    }
    return newName;
}

